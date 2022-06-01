import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAsync } from 'react-use';
import { ArrowLeftIcon } from '@heroicons/react/outline';

import { getPublicationByHandle } from '@/services/publications';

import { Container } from '@/components/Container';
import { Loading, LoadingIndicator, LoadingMessage } from '@/components/Loading';
import { SmallCaps } from '@/components/SmallCaps';

import { useReader } from './hooks/useReader';
import { TableOfContentsMenu } from './TableOfContentsMenu';
import { NavigationButton } from './NavigationButton';

export const PublicationDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const { value, loading } = useAsync(
    () =>
      getPublicationByHandle(handle!).then(async (item) => {
        if (!item) return navigate('/publications');

        return item;
      }),
    [handle]
  );

  const ref = React.useRef<HTMLDivElement>(null);
  const reader = useReader(ref, value);

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white shadow z-10">
        <Container className="flex items-center h-16 sm:h-24">
          <button
            className="flex items-center justify-center w-10 h-10 mr-2 rounded hover:bg-gray-100 hover:bg-opacity-10 sm:mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 mr-2">
            <h1 className="truncate font-medium">{value?.title}</h1>
            <SmallCaps>
              {!!reader.book?.rendition?.location?.end?.displayed.total &&
                `${reader.book?.rendition?.location?.end?.displayed.total} pages`}
            </SmallCaps>
          </div>

          {reader.tocItems.length > 0 && (
            <TableOfContentsMenu
              items={reader.tocItems}
              onNavigate={(item) => reader.book?.rendition.display(item.href)}
            />
          )}
        </Container>
      </header>

      <Container className="relative flex-1 w-full">
        <Loading
          visible={loading || !reader.book?.rendition}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <LoadingMessage>
            <LoadingIndicator className="w-4 h-4" />
            <div>Loading...</div>
          </LoadingMessage>
        </Loading>

        <div {...{ ref }} className="w-full h-full bg-gray-100 overflow-hidden"></div>

        {!!reader.book?.rendition?.location && !reader.book.rendition.location.atStart && (
          <NavigationButton type="previous" onClick={() => reader.book?.rendition.prev()} />
        )}

        {!!reader.book?.rendition?.location && !reader.book.rendition.location.atEnd && (
          <NavigationButton type="next" onClick={() => reader.book?.rendition.next()} />
        )}
      </Container>
    </div>
  );
};
