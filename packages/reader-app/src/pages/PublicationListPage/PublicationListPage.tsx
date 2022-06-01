import React from 'react';
import { useAsync } from 'react-use';

import { getPublications } from '@/services/publications';

import { useSearchQueryParams } from '@/hooks/useSearchQueryParams';

import { Search } from '@/components/Search';
import { Container } from '@/components/Container';
import { SmallCaps } from '@/components/SmallCaps';
import { PublicationTile } from '@/components/PublicationTile';

export const PublicationListPage: React.FC = () => {
  const { params, update } = useSearchQueryParams();

  const { value: publications } = useAsync(
    () => getPublications({ query: params.query, page: 1, size: 100 }),
    [params]
  );

  const onSearch = React.useCallback((query: string) => update({ query }), [update]);

  return (
    <React.Fragment>
      <header className="relative bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900">
        <Container className="flex items-center justify-center h-24 sm:h-56">
          <Search id="search" value={params.query} placeholder="Search..." {...{ onSearch }} />
        </Container>
      </header>

      <main>
        <Container className="py-6">
          {publications?.count ? (
            <div className="space-y-6">
              <SmallCaps>Publications</SmallCaps>

              <ul className="grid gap-6 grid-cols-5 min-h-0 min-w-0 overflow-hidden">
                {(publications?.items ?? []).map((item) => (
                  <li key={item.objectID} className="min-h-0 overflow-hidden">
                    <PublicationTile {...{ item }} />
                  </li>
                ))}
              </ul>
            </div>
          ) : publications ? (
            <div className="text-2xl text-center font-medium">No publications found.</div>
          ) : null}
        </Container>
      </main>
    </React.Fragment>
  );
};
