import { EntryWithAllLocalesAndWithoutLinkResolution } from 'contentful';
import { createClient } from 'contentful-management';

export enum Locale {
  English = 'en-US'
}

export type LocalizedFields<T> = EntryWithAllLocalesAndWithoutLinkResolution<T, Locale>['fields'];

export const withLocale = <T extends {}, L extends Locale>(
  data: T,
  locale: L,
  initial: Partial<LocalizedFields<T>> = {}
) => {
  return Object.entries(data).reduce<LocalizedFields<T>>((data, [key, value]) => {
    data[key as keyof T] = { [locale]: value };
    return data;
  }, initial as LocalizedFields<T>);
};

export const contentful = createClient(
  { accessToken: process.env.CONTENTFUL_ACCESS_TOKEN! },
  { type: 'plain', defaults: { spaceId: '5hqwzcs3dszo', environmentId: 'master' } }
);
