import { Readable } from 'stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '@botondveress/logger';

const client = new S3Client({});

export const getKey = (key: string) => decodeURIComponent(key.replace(/\+/g, ' '));

interface UploadFileOptions {
  bucket: string;
  key: string;
  acl: 'private' | 'public-read';
  body: Buffer | Blob | Readable;
}

export const uploadFile = async ({ bucket, key, acl, body }: UploadFileOptions) => {
  key = getKey(key);

  logger.info({ bucket, key }, `Upload file to storage.`);

  const upload = new Upload({
    client,
    params: { Bucket: bucket, ACL: acl, Key: key, Body: body }
  });

  await upload.done();
};

interface DownloadFileOptions {
  bucket: string;
  key: string;
}

export const downloadFile = async ({ bucket, key }: DownloadFileOptions) => {
  key = getKey(key);

  logger.info({ bucket, key }, `Download file to storage.`);

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
  );

  return response.Body as Readable;
};

export const getBufferFromStream = (stream: Readable) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.once('end', () => resolve(Buffer.concat(chunks)));
    stream.once('error', reject);
  });
};

interface GetObjectSignedUrlOptions {
  bucket: string;
  key: string;
  expiresIn: number;
}

export const getObjectSignedUrl = ({ bucket, key, expiresIn }: GetObjectSignedUrlOptions) => {
  logger.info({ bucket, key, expiresIn }, `Get signed url.`);

  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
};
