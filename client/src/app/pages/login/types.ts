import { ValidationRules } from "src/app/types/global.types"

export interface LoginValidationRules {
  email: ValidationRules;
  password: ValidationRules;
}