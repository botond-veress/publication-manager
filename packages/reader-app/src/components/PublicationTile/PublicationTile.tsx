import React from 'react';
import { Link } from 'react-router-dom';
import { AlgoliaPublication } from '@botondveress/algolia-types';

import { resizeImage } from '@/services/image';

import { SmallCaps } from '@/components/SmallCaps';

interface Props {
  item: AlgoliaPublication;
}

export const PublicationTile: React.FC<Props> = ({ item }) => (
  <Link to={`/publications/${item.handle}`} className="relative w-full h-full space-y-2">
    <div className="relative aspect-square bg-gray-100 overflow-hidden">
      {!!item.image && (
        <img src={resizeImage(item.image, { width: 800, height: 800 })} className="absolute inset-0 object-cover" />
      )}

      <SmallCaps className="absolute top-2 right-2 p-1 rounded bg-white border border-solid border-gray-100">
        {item.language}
      </SmallCaps>
    </div>

    <div className="text-sm">
      <div className="truncate text-gray-800 font-semibold">{item.title}</div>
      <div className="text-gray-500">
        <div>{item.author}</div>
        <div>{item.publishedAt}</div>
      </div>
    </div>
  </Link>
);
