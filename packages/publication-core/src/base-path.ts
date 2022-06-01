import { Book } from 'epubjs';

export const getBasePathFromBook = (book: Book) => {
  const navigationPath = book.packaging.navPath || book.packaging.ncxPath;

  const { dir } = book.path.parse(navigationPath) as { dir: string };

  return dir;
};
