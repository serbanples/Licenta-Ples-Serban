import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Method used to validate request data before handing it to the server
 * 
 * @param {any} dtoClass validation class used.
 * @returns {Function} validated object or throw 400 error.
 */
export function validateRequest(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // Convert request body to class instance
    const dtoInstance = plainToInstance(dtoClass, req.body);
    
    // Validate request data
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map(err => ({
          field: err.property,
          constraints: err.constraints
        }))
      });
    }

    next();
  };
}
