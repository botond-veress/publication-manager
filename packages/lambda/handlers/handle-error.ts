import { logger } from '@botondveress/logger';
import { HttpError, InternalServerError } from '../errors';

export const handleError = (error: Error): HttpError => {
  if (!(error instanceof HttpError)) {
    return handleError(new InternalServerError({ cause: error }));
  }

  const cause = error.options.cause ?? error;

  logger.error({ err: cause }, cause.message);

  return error;
};
