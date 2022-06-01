import { PassThrough } from 'stream';
import { createCipheriv, randomBytes } from 'crypto';

import { handleEvent } from '@botondveress/lambda';
import { logger } from '@botondveress/logger';
import { downloadFile, uploadFile } from '@botondveress/storage';

import { getPublicationMetadataFromEvent, PublicationMetadataEvent } from '../services/publication-metadata';
import { FileResponse } from '../types';

export const handler = handleEvent<PublicationMetadataEvent, FileResponse>(async (event) => {
  logger.info({ event }, 'Encrypt publication.');

  const { id, download } = await getPublicationMetadataFromEvent(event).then(async ({ id, bucket, key }) => ({
    id,
    download: await downloadFile({ bucket, key: decodeURIComponent(key) })
  }));

  const bucket = process.env.S3_BUCKET!;
  const key = `encrypted-publications/${id}/${randomBytes(16).toString('hex')}.epub`;

  const encrypt = createCipheriv('aes-128-cbc', Buffer.from(id, 'hex'), Buffer.from(id, 'hex'));

  const upload = new PassThrough();

  const promise = uploadFile({ bucket, key, acl: 'private', body: upload });

  download.pipe(encrypt).pipe(upload);

  await promise;

  return { bucket, key };
});
