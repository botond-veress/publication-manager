import { Book } from 'epubjs';

export const getCoverImageBase64 = async (book: Book) => {
  return book.loaded.cover.then((cover) => book.archive.createUrl(cover, { base64: true }));
};
