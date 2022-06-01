import { randomBytes } from 'crypto';

import { handleEvent } from '@botondveress/lambda';
import { logger } from '@botondveress/logger';
import { uploadFile } from '@botondveress/storage';

import { getImageDataFromBase64 } from '../services/image';
import { getPublicationMetadataFromEvent, PublicationMetadataEvent } from '../services/publication-metadata';
import { FileResponse } from '../types';

export const handler = handleEvent<PublicationMetadataEvent, FileResponse | undefined>(async (event) => {
  logger.info({ event }, 'Extract cover image.');

  const { id, publication } = await getPublicationMetadataFromEvent(event);

  if (!publication.coverImage) {
    logger.info('No cover image found in metadata.');
    return;
  }

  const image = getImageDataFromBase64(publication.coverImage);

  if (!image) {
    logger.info(`The cover image couldn't be decoded.`);
    return;
  }

  const bucket = process.env.S3_BUCKET!;
  const key = `cover-images/${id}/${randomBytes(16).toString('hex')}.${image.extension}`;

  await uploadFile({ bucket, key, acl: 'private', body: image.buffer });

  return { bucket, key };
});
