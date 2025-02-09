import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequest } from '../../config/exceptions';

/**
 * Method used to validate RPC calls before processing them on the server.
 * 
 * @param {T} dtoClass typeof data to validate.
 * @param {any} data data to validate.
 * @returns {Promise<any>} validated object / throws bad request error if not.
 */
export async function validateRPC<T extends Object>(dtoClass: new () => T, data: any): Promise<T> {
  const instance = plainToInstance(dtoClass, data);
  console.log('data', data)
  const errors = await validate(instance);

  if (errors.length > 0) {
    throw new BadRequest({
      message: "Validation failed",
      errors: errors.map(err => ({
        field: err.property,
        constraints: err.constraints
      }))
    })
  }

  return instance;
}
