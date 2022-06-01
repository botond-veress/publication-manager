import { ScheduledEvent, ScheduledHandler } from 'aws-lambda';

import { EventHandler, handleEvent } from './handle-event';
import { handleError } from './handle-error';

export const handleScheduled = <T>(callback: EventHandler<ScheduledEvent<T>, void>): ScheduledHandler => {
  return handleEvent<ScheduledEvent<T>, void>(async (event, context) => {
    await Promise.resolve()
      .then(() => callback(event, context))
      .catch((error) => {
        throw handleError(error);
      });
  });
};
