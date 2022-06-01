import { stringifyUrl } from 'query-string';

interface ResizeImageOptions {
  width: number;
  height: number;
  quality?: number;
  format?: 'webp' | 'avif';
  fit?: string;
}

export const resizeImage = (
  url: string,
  { width: w, height: h, quality: q, format: fm, fit = 'thumb' }: ResizeImageOptions
) => stringifyUrl({ url, query: { w, h, q, fm, fit } });
