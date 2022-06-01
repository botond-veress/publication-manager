import { createCipheriv } from 'crypto';

import { logger } from '@botondveress/logger';

export const getKey = () => 'feffe9928665731c6d6a8f9467308308';
export const getIV = () => 'cafebabefacedbaddecaf888';

export const encryptStream = (key: string, iv: string) => {
  logger.info({ key, iv }, 'Encrypt stream.');

  return createCipheriv('aes-256-cbc', key, iv);
};
