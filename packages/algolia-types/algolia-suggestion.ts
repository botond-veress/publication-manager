import { AlgoliaObject } from './algolia-object';

export interface AlgoliaSuggestion extends AlgoliaObject {
  query: string;
}
