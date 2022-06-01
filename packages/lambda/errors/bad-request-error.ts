import { HttpError, HttpErrorOptions } from './http-error';

export class BadRequestError extends HttpError {
  constructor(options?: Partial<HttpErrorOptions>) {
    super(400, {
      ...options,
      message: options?.message ?? 'Bad request.'
    });
  }
}
