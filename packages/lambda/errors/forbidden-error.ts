import { HttpError, HttpErrorOptions } from './http-error';

export class ForbiddenError extends HttpError {
  constructor(options?: Partial<HttpErrorOptions>) {
    super(403, {
      ...options,
      message: options?.message ?? 'Forbidden'
    });
  }
}
