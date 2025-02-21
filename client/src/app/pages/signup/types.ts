import { ValidationRules } from "src/app/types/global.types"

export interface SignupValidationRules {
  username: ValidationRules;
  email: ValidationRules;
  password: ValidationRules;
  confirmPassword: ValidationRules;
}