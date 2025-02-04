import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from "../util/decorators/match.decorator";

/** regex for password strength: 8 char, uppecase, lowercase, special char */
const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Class used for validating Login Forms
 */
export class LoginForm {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(passwordValidation)
  password!: string;
}

/**
 * Class used for validating Registration Forms
 */
export class RegisterForm {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(passwordValidation, {message: 'Password needs to be stronger'})
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match!' })
  confirmPassword!: string;
}

export interface Token {
  token: string;
}