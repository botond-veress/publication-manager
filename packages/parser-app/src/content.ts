import { Book } from 'epubjs';
import { PublicationContentItem } from '@botondveress/publication-core';

type Section = ReturnType<Book['spine']['first']>;

const getSpineSections = (book: Book) => {
  const map = new Map<string, Section>();

  book.spine.unpack(
    book.packaging,
    (href: string) => {
      const item = book.spine.get(href);

      if (item) map.set(href, item);
    },
    book.canonical.bind(book)
  );

  return Array.from(map.values());
};

export const getContentFromBook = async (book: Book) => {
  const sections = getSpineSections(book);

  const documents = await Promise.all(sections.map((section) => Promise.resolve(section.load(book.load.bind(book)))));

  return documents
    .flatMap((document) => document.textContent?.split(/\r?\n/g) ?? [])
    .map((text) => text.trim())
    .filter((text) => text)
    .map<PublicationContentItem>((text) => ({ cfi: 'TODO', text }));
};
