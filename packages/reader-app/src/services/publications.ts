import { AlgoliaPublication } from '@botondveress/algolia-types';

import { algolia, AlgoliaOptions, AlgoliaResult, publicationIndex } from './algolia';

interface GetPublicationsOptions extends AlgoliaOptions {
  page: number;
  size: number;
}

export const getPublications = ({
  query,
  page,
  size
}: GetPublicationsOptions): Promise<AlgoliaResult<AlgoliaPublication>> => {
  return algolia
    .search([
      {
        indexName: publicationIndex,
        query,
        params: { page: page - 1, hitsPerPage: size }
      }
    ])
    .then(({ results }) => results)
    .then(([product]) => ({
      count: product.nbHits,
      items: product.hits as []
    }));
};

export const getPublicationByHandle = (handle: string): Promise<AlgoliaPublication | undefined> => {
  return algolia
    .search([{ indexName: publicationIndex, params: { filters: `handle:${handle}` } }])
    .then(({ results }) => results)
    .then(([results]) => results.hits[0] as AlgoliaPublication);
};
