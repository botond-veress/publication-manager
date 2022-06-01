import { EventBridgeEvent, S3EventRecord } from 'aws-lambda';

import { downloadFile, getBufferFromStream } from '@botondveress/storage';
import { PublicationMetadataFile } from '@botondveress/parser-types';
import { logger } from '@botondveress/logger';

export interface PublicationMetadataEvent extends EventBridgeEvent<string, S3EventRecord['s3']> {}

export const getPublicationMetadata = ({ bucket, key }: { bucket: string; key: string }) => {
  logger.info({ bucket, key }, `Get publication metadata.`);

  return downloadFile({ bucket, key })
    .then(getBufferFromStream)
    .then((buffer): PublicationMetadataFile => JSON.parse(buffer.toString('utf-8')));
};

export const getPublicationMetadataFromEvent = (event: PublicationMetadataEvent) => {
  logger.info({ event }, `Get publication metadata from event.`);

  const bucket = event.detail.bucket.name;
  const key = event.detail.object.key;

  return getPublicationMetadata({ bucket, key });
};
