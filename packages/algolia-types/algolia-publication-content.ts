import { AlgoliaPublication } from './algolia-publication';

export interface AlgoliaPublicationContent extends AlgoliaPublication {
  content: string;
  cfi: string;
}
