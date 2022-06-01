import { EntryProps } from 'contentful-management';
import { logger } from '@botondveress/logger';

import { contentful, Locale, LocalizedFields, withLocale } from './contentful';

export const getEntry = async <T>(entryId: string) => {
  logger.info({ entryId }, `Get entry.`);

  return contentful.entry.get<LocalizedFields<T>>({ entryId });
};

export const createEntry = async <T>(entryId: string, contentTypeId: string, fields: T) => {
  logger.info({ entryId, fields }, `Create entry.`);

  return contentful.entry.createWithId<LocalizedFields<T>>(
    { entryId, contentTypeId },
    { fields: withLocale(fields, Locale.English) }
  );
};

export const updateEntry = async <T>(entry: EntryProps<LocalizedFields<T>>, fields: T) => {
  logger.info({ entryId: entry.sys.id, fields }, `Update entry.`);

  return contentful.entry.update<LocalizedFields<T>>(
    { entryId: entry.sys.id },
    { ...entry, fields: withLocale(fields, Locale.English, entry.fields) }
  );
};

export const upsertEntry = async <T>(entryId: string, contentTypeId: string, fields: T) => {
  logger.info({ entryId, fields }, `Upsert entry.`);

  const entry = await getEntry<T>(entryId).catch(() => null);

  if (!entry) return createEntry<T>(entryId, contentTypeId, fields);

  return updateEntry<T>(entry, fields);
};

export const publishEntry = async <T>(entry: EntryProps<LocalizedFields<T>>) => {
  logger.info({ entryId: entry.sys.id }, `Publish entry.`);

  return contentful.entry.publish({ entryId: entry.sys.id }, entry);
};
