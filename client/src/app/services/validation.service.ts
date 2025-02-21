import { ValidationRules } from "../types/global.types";
import { Validators } from "@angular/forms";

export class ValidationService {

  static createValidators(validation: ValidationRules) {
    const validations: Array<Validators> = [];

    if(validation.required) validations.push(Validators.required);
    if(validation.pattern) validations.push(Validators.pattern(validation.pattern));
    if(validation.email) validations.push(Validators.email);
    if(validation.maxLength) validations.push(Validators.maxLength(validation.maxLength));
    if(validation.minLength) validations.push(Validators.minLength(validation.minLength));

    return validations;
  }
  
}