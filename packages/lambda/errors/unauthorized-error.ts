import { HttpError, HttpErrorOptions } from './http-error';

export class UnauthorizedError extends HttpError {
  constructor(options?: Partial<HttpErrorOptions>) {
    super(401, {
      ...options,
      message: options?.message ?? 'Unauthorized'
    });
  }
}
