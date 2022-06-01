import algoliasearch from 'algoliasearch';

export const algolia = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_ADMIN_API_KEY!);
export const publicationIndex = algolia.initIndex(process.env.ALGOLIA_INDEX_PUBLICATION!);
export const publicationContentIndex = algolia.initIndex(process.env.ALGOLIA_INDEX_PUBLICATION_CONTENT!);
