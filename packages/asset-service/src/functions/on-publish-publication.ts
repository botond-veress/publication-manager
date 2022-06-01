import { EntryProps } from 'contentful-management';

import { ensureBasicAuth, handleHttp } from '@botondveress/lambda';
import { logger } from '@botondveress/logger';
import { AlgoliaPublication, AlgoliaPublicationContent } from '@botondveress/algolia-types';

import { publicationContentIndex, publicationIndex } from '../services/algolia';
import { getAsset, Locale, LocalizedFields } from '../services/contentful';
import { ContentfulPublication } from '../services/publication';
import { getPublicationMetadata } from '../services/publication-metadata';

// await publicationIndex.setSettings({
//   searchableAttributes: ['title']
//   attributesForFaceting: ['filterOnly(handle)']
// });

// await publicationContentIndex.setSettings({
//   searchableAttributes: ['content'],
//   attributeForDistinct: 'content',
//   attributesToSnippet: ['content']
// });

export const handler = handleHttp(async (event) => {
  logger.info({ event }, 'Contentful webhook on publish.');

  await ensureBasicAuth(event, process.env.CONTENTFUL_WEBHOOK_BASIC_AUTH!);

  const body = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf-8') : event.body ?? '';

  const entry = JSON.parse(body) as EntryProps<LocalizedFields<ContentfulPublication>>;

  logger.info({ entry }, 'Contentful entry received.');

  const epubAssetId = entry.fields.epub['en-US']?.sys.id;
  const coverAssetId = entry.fields.cover['en-US']?.sys.id;

  const epub = await getAsset(epubAssetId!).then((asset) => asset.fields.file[Locale.English].url!);

  const image = coverAssetId
    ? await getAsset(coverAssetId)
        .then((asset) => asset?.fields.file[Locale.English].url)
        .catch(() => undefined)
    : undefined;

  const { id, publication, handle } = await getPublicationMetadata({
    bucket: process.env.S3_BUCKET!,
    key: `metadata/${entry.sys.id}.json`
  });

  const metadata = {
    handle,
    image,
    epub,
    title: publication.metadata.title,
    language: publication.metadata.language,
    author: publication.metadata.author,
    publishedAt: publication.metadata.publishedAt
  };

  await publicationIndex.saveObject({ objectID: id, ...metadata } as AlgoliaPublication);

  await publicationContentIndex.deleteBy({ filters: `publicationId:${id}` });

  await publicationContentIndex.saveObjects(
    publication.contents.slice(0, 500).map<AlgoliaPublicationContent>(({ text: content, cfi }, index) => ({
      objectID: `${id}-${index + 1}`,
      content,
      cfi,
      ...metadata
    }))
  );
});
