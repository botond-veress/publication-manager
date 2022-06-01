import pino from 'pino';
import { pinoLambdaDestination } from 'pino-lambda';

export { lambdaRequestTracker } from 'pino-lambda';

const destination = pinoLambdaDestination();

export const logger = pino(
  {
    base: {
      environment: process.env.ENVIRONMENT,
      version: process.env.VERSION
    },
    ...(!!process.env.IS_OFFLINE && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          sync: true
        }
      }
    })
  },
  destination
);
