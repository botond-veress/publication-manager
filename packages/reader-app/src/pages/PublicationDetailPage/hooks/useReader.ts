import React from 'react';
import axios from 'axios';
import { Book } from 'epubjs';
import { AlgoliaPublication } from '@botondveress/algolia-types';
import { PublicationTOCItem, getTOCItemsFromBook } from '@botondveress/publication-core';

import { decryptAESCBC } from '@/services/crypto';

interface ReaderProgress {
  cfi: string;
  page: { current: number; total: number };
}

export const useReader = (ref: React.RefObject<HTMLDivElement>, publication: AlgoliaPublication) => {
  const [tocItems, setTOCItems] = React.useState<PublicationTOCItem[]>([]);
  const [progress, setProgress] = React.useState<ReaderProgress>({ cfi: '', page: { current: 0, total: 0 } });

  const book = React.useMemo(() => {
    if (!publication?.epub) return;

    const book = new Book(publication.epub, {
      async requestMethod(url) {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });

        return decryptAESCBC({ key: publication.objectID, iv: publication.objectID, data });
      }
    });

    book.ready.then(() => getTOCItemsFromBook(book).then(setTOCItems));

    return book;
  }, [publication]);

  React.useEffect(() => {
    if (!book || !ref.current) return;

    const rendition = book.renderTo(ref.current, {
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
      resizeOnOrientationChange: true,
      flow: 'paginated',
      infinite: true
    });

    rendition.on('relocated', (location: Book['rendition']['location']) => {
      setProgress({
        cfi: location.start.cfi,
        page: { current: location.end.displayed.page, total: location.end.displayed.total }
      });
    });

    rendition.display().catch(() => null);

    return () => rendition.destroy();
  }, [book, ref]);

  return { book, progress, tocItems };
};
