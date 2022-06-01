import createEpub from 'epubjs';
import { Publication, getTOCItemsFromBook } from '@botondveress/publication-core';

import { getMetadata } from './metadata';
import { getCoverImageBase64 } from './cover';
import { getContentFromBook } from './content';

const parsePublication = async (url: string): Promise<Publication> => {
  const book = createEpub(url);

  await book.ready;

  const tocs = await getTOCItemsFromBook(book);

  const [contents, metadata, coverImage] = await Promise.all([
    getContentFromBook(book),
    getMetadata(book),
    getCoverImageBase64(book)
  ]);

  return { tocs, metadata, contents, coverImage };
};

declare global {
  interface Window {
    __parsePublication(url: string): Promise<Publication>;
  }
}

window.__parsePublication = parsePublication;
