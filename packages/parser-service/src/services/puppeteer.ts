import chromium from 'chrome-aws-lambda';
import { Browser } from 'puppeteer-core';
import { logger } from '@botondveress/logger';

export const runWithPuppeteer = async <T>(callback: (browser: Browser) => Promise<T>): Promise<T> => {
  logger.info(`Run with puppeteer.`);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true
  });

  const result = await callback(browser);

  await browser.close();

  return result;
};
