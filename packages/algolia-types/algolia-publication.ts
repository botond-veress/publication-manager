import { AlgoliaObject } from './algolia-object';

export interface AlgoliaPublication extends AlgoliaObject {
  handle: string;
  title: string;
  image?: string;
  epub: string;
  language: string;
  author: string;
  publishedAt: string;
}
