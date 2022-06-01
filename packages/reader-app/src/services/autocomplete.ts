import memoizee from 'memoizee';
import { AlgoliaSuggestion, AlgoliaPublication, AlgoliaPublicationContent } from '@botondveress/algolia-types';

import {
  algolia,
  AlgoliaOptions,
  AlgoliaResult,
  publicationSuggestionIndex,
  publicationContentIndex,
  publicationIndex
} from './algolia';

export interface AutocompleteResponse {
  suggestion: AlgoliaResult<AlgoliaSuggestion>;
  publication: AlgoliaResult<AlgoliaPublication>;
  content: AlgoliaResult<AlgoliaPublicationContent>;
}

export const getAutocomplete = memoizee(({ query }: AlgoliaOptions): Promise<AutocompleteResponse> => {
  return algolia
    .search([
      {
        indexName: publicationSuggestionIndex,
        query,
        params: { hitsPerPage: 3 }
      },
      {
        indexName: publicationIndex,
        query,
        params: { hitsPerPage: 5 }
      },
      {
        indexName: publicationContentIndex,
        query,
        params: { hitsPerPage: 5, distinct: true }
      }
    ])
    .then(({ results }) => results)
    .then(([suggestion, publication, content]) => ({
      suggestion: {
        count: suggestion.nbHits,
        items: suggestion.hits as AlgoliaSuggestion[]
      },
      publication: {
        count: publication.nbHits,
        items: publication.hits as AlgoliaPublication[]
      },
      content: {
        count: content.nbHits,
        items: content.hits as AlgoliaPublicationContent[]
      }
    }));
});
