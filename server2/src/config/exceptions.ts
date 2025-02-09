/** BadRequest error maps to 400 status code */
export class BadRequest extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'BadRequest';
  }
}

/** NotFound error maps to 404 status code */
export class NotFound extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'NotFound';
  }
}

/** Unauthorized error maps to 401 status code */
export class Unauthorized extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'Unauthorized';
  }
}

/** NotAvailable error maps to 503 status code */
export class NotAvailable extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'NotAvailable';
  }
}

/** NotAvailable error maps to 500 status code */
export class InternalServerError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'InternalServer';
  }
}

/** ValidationErr maps to 403 but with additional info about unvalidated fields. */
export class ValidationErr extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ValidationErr';
  }
}