import { Book } from 'epubjs';
import { PublicationMetadata } from '@botondveress/publication-core';

export const getMetadata = async (book: Book): Promise<PublicationMetadata> => {
  const { title, description, language, creator, pubdate } = await book.loaded.metadata;

  return {
    title,
    description,
    language,
    author: creator,
    publishedAt: pubdate
  };
};
