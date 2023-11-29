class ExtendedError extends Error {
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'ExtendedError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExtendedError);
    }
  }
}

export default ExtendedError;
