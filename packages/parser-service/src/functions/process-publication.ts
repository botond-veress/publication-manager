import { S3Event } from 'aws-lambda';
import slugify from 'slugify';
import { createHash } from 'crypto';

import { handleEvent } from '@botondveress/lambda';
import { logger } from '@botondveress/logger';
import { PublicationMetadataFile } from '@botondveress/parser-types';
import { Publication } from '@botondveress/publication-core';
import { getKey, getObjectSignedUrl, uploadFile } from '@botondveress/storage';

import { runWithPuppeteer } from '../services/puppeteer';

const getHashFromKey = (key: string) => createHash('md5').update(key).digest('hex');

export const handler = handleEvent<S3Event, void>(async (event) => {
  logger.info({ event }, `Process publication.`);

  const record = event.Records[0];

  const bucket = record.s3.bucket.name;
  const key = getKey(record.s3.object.key);

  const url = await getObjectSignedUrl({ bucket, key, expiresIn: 3600 });

  const publication = await runWithPuppeteer<Publication>(async (browser) => {
    logger.info({ parserUrl: process.env.PARSER_APP_URL!, url }, `Running application.`);

    const page = await browser.newPage();

    await page.goto(process.env.PARSER_APP_URL!);

    page.on('console', (event) =>
      logger.info(
        { type: event.type(), message: event.text(), stackTrace: event.stackTrace(), location: event.location() },
        `Console message.`
      )
    );

    return await page.evaluate(`__parsePublication(${JSON.stringify(url)})`);
  });

  const id = getHashFromKey(key);
  const handle = slugify(publication.metadata.title, { replacement: '-', strict: true, lower: true, trim: true });
  const body: PublicationMetadataFile = { id, bucket, key, publication, handle };

  await uploadFile({
    bucket: process.env.S3_BUCKET!,
    key: `metadata/${id}.json`,
    acl: 'private',
    body: Buffer.from(JSON.stringify(body, null, 2))
  });
});
