import algoliasearch from 'algoliasearch/lite';

import {
  ALGOLIA_API_KEY,
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX_PUBLICATION,
  ALGOLIA_INDEX_PUBLICATION_CONTENT,
  ALGOLIA_INDEX_PUBLICATION_SUGGESTION
} from '@/config';

export const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

export const publicationIndex = ALGOLIA_INDEX_PUBLICATION;
export const publicationContentIndex = ALGOLIA_INDEX_PUBLICATION_CONTENT;
export const publicationSuggestionIndex = ALGOLIA_INDEX_PUBLICATION_SUGGESTION;

export interface AlgoliaResult<T> {
  count: number;
  items: T[];
}

export interface AlgoliaOptions {
  query: string;
}
