import React from 'react';

import { resizeImage } from '@/services/image';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const PublicationImage: React.FC<Props> = ({ src, ...props }) => (
  <picture>
    <source type="image/avif" src={resizeImage(src, { width: 500, height: 500, quality: 90, format: 'avif' })} />
    <source type="image/webp" src={resizeImage(src, { width: 500, height: 500, quality: 90, format: 'webp' })} />
    <img
      {...props}
      src={resizeImage(src, { width: 500, height: 500, quality: 90, format: 'webp' })}
      loading="lazy"
      decoding="async"
    />
  </picture>
);
