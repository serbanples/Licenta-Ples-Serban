import { BadRequest, InternalServerError, NotAvailable, NotFound, Unauthorized, ValidationErr } from "../../../config/exceptions"

/**
 * Method used to handle errors from rpc calls.
 * 
 * @param {any} error error from rpc call.
 * @returns {Error} typed error
 */
export const handleRpcError = (error: any): Error => {
  switch(error.name) {
    case 'BadRequest': 
      return new BadRequest(error.message);
    case 'NotFound': 
      return new NotFound(error.message);
    case 'Unauthorized': 
      return new Unauthorized(error.message);
    case 'NotAvailable':
      return new NotAvailable(error.message);
    case 'ValidationErr':
      return new ValidationErr({ message: error.message, errors: error.errors });
    default: 
      return new InternalServerError(error.message);
  }
}