import { HttpError, HttpErrorOptions } from './http-error';

export class InternalServerError extends HttpError {
  constructor(options?: Partial<HttpErrorOptions>) {
    super(500, {
      ...options,
      message: options?.message ?? 'Internal Server Error'
    });
  }
}
