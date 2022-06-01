import React from 'react';

import { SmallCaps } from '@/components/SmallCaps';

interface Props {
  title?: React.ReactNode;
}

export const SearchResultGroup: React.FC<React.PropsWithChildren<Props>> = ({ title, children }) => (
  <section>
    {!!title && <SmallCaps className="px-3 py-2">{title}</SmallCaps>}
    <ul>{children}</ul>
  </section>
);
