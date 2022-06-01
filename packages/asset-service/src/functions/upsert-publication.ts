import path from 'path';
import { lookup } from 'mime-types';

import { handleEvent } from '@botondveress/lambda';
import { logger } from '@botondveress/logger';
import { getObjectSignedUrl } from '@botondveress/storage';

import {
  upsertAsset,
  Locale,
  processAsset,
  upsertEntry,
  publishEntry,
  createLinkFromAsset,
  withLocale,
  publishAsset
} from '../services/contentful';
import { getPublicationMetadataFromEvent, PublicationMetadataEvent } from '../services/publication-metadata';
import { FileResponse } from '../types';

export const handler = handleEvent<
  [PublicationMetadataEvent, FileResponse, FileResponse | undefined, null],
  { id: string }
>(async ([event, publication, cover]) => {
  logger.info({ event }, 'Upsert publication.');

  const {
    id,
    publication: {
      metadata: { title }
    }
  } = await getPublicationMetadataFromEvent(event);

  const [publicationAsset, coverAsset] = await Promise.all([
    upsertAsset(
      `publication-${id}`,
      withLocale(
        {
          title: `[Publication] ${title}`,
          file: {
            fileName: path.basename(publication.key),
            contentType: lookup(publication.key) || '',
            upload: await getObjectSignedUrl({ ...publication, expiresIn: 300 })
          }
        },
        Locale.English
      )
    )
      .then(processAsset)
      .then(publishAsset)
      .then(createLinkFromAsset),
    ...(cover
      ? [
          upsertAsset(
            `cover-${id}`,
            withLocale(
              {
                title: `[Cover] ${title}`,
                file: {
                  fileName: path.basename(cover.key),
                  contentType: lookup(cover.key) || '',
                  upload: await getObjectSignedUrl({ ...cover, expiresIn: 300 })
                }
              },
              Locale.English
            )
          )
            .then(processAsset)
            .then(publishAsset)
            .then(createLinkFromAsset)
        ]
      : [])
  ]);

  await upsertEntry(id, 'publication', { title, epub: publicationAsset, cover: coverAsset }).then(publishEntry);

  return { id };
});
