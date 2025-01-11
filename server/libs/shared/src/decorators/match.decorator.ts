import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Match decorator used for register account in order to verify that confirm password matches password.
 * 
 * @param {string} property property to match.
 * @param {ValidationOptions} validationOptions additional options.
 * @returns {Function} validates data.
 */
export function Match(property: string, validationOptions: ValidationOptions): Function {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    })
  }
}