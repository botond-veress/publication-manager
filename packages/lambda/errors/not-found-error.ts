import { HttpError, HttpErrorOptions } from './http-error';

export class NotFoundError extends HttpError {
  constructor(options?: Partial<HttpErrorOptions>) {
    super(404, {
      ...options,
      message: options?.message ?? 'Not found.'
    });
  }
}
