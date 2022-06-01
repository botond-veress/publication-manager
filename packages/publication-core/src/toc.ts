import { Book, NavItem } from 'epubjs';
import { join } from 'path-browserify';

import { getBasePathFromBook } from './base-path';
import { PublicationTOCItem } from './types';

const getSpineComponentFromHref = (href: string) => href.split('#')[0];
const getPositonComponentFromHref = (href: string) => href.split('#')[1];

const getTOCItemFromBook = async (book: Book, item: NavItem): Promise<PublicationTOCItem> => {
  await book.ready;

  const directory = getBasePathFromBook(book);

  const spineComponent = getSpineComponentFromHref(item.href);
  const positonComponent = getPositonComponentFromHref(item.href);

  const href = join(directory, spineComponent);

  const spineItem = book.spine.get(href);

  await (spineItem.load(book.load.bind(book)) as any as Promise<void>);

  const el = spineItem.document.getElementById(positonComponent);
  const cfi = spineItem.cfiFromElement(el!);

  return { title: item.label, cfi, href, items: await getTOCItemsFromBook(book, item.subitems ?? []) };
};

export const getTOCItemsFromBook = async (book: Book, items?: NavItem[]) => {
  await book.ready;

  items = items ?? book.navigation.toc;

  return items.reduce<Promise<PublicationTOCItem[]>>(async (promise, item) => {
    const items = await promise;

    return [...items, await getTOCItemFromBook(book, item)];
  }, Promise.resolve([]));
};
