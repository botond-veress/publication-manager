import { logger } from '@botondveress/logger';

const pattern = /^data:image\/([\w+]+);base64,([\s\S]+)/;
const extensionMap: Record<string, string> = { jpeg: 'jpg', 'svg+xml': 'svg' };

export const getImageDataFromBase64 = (data: string) => {
  logger.info('Get image data from base 64.');

  const match = data.match(pattern);

  if (!match) return;

  const mimeType = match[1];
  const extension = extensionMap[mimeType] ?? mimeType;
  const buffer = Buffer.from(match[2], 'base64');

  return { extension, buffer };
};
