/** BadRequest error maps to 400 status code */
export class BadRequest extends Error {
  constructor(message: any) {
      super(message);
  }
}

/** NotFound error maps to 404 status code */
export class NotFound extends Error {
  constructor(message: any) {
      super(message);
  }
}

/** Unauthorized error maps to 401 status code */
export class Unauthorized extends Error {
  constructor(message: any) {
      super(message);
  }
}

/** NotAvailable error maps to 503 status code */
export class NotAvailable extends Error {
  constructor(message: any) {
      super(message);
  }
}