export interface HttpErrorOptions {
  message: string;
  cause?: Error;
}

export class HttpError extends Error {
  constructor(public statusCode: number, public options: HttpErrorOptions) {
    super(options.message ?? 'Unknown error.');
  }

  serialize() {
    return {
      message: this.message
    };
  }
}
