import { Context } from 'aws-lambda';
import { lambdaRequestTracker, logger } from '@botondveress/logger';

export type EventHandler<E, R> = (event: E, context: Context) => Promise<R>;

const withRequest = lambdaRequestTracker();

export const handleEvent = <E, R>(callback: EventHandler<E, R>): EventHandler<E, R> => {
  return async (event, context) => {
    withRequest(event ?? {}, context ?? {});

    logger.debug({ event }, `Handle event.`);

    context.callbackWaitsForEmptyEventLoop = false;

    return Promise.resolve().then(() => callback(event, context));
  };
};
