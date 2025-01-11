import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from "../decorators/match.decorator";

/**
 * one upper case, one lower case one digit one special, at least 8 char.
 */
const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validator class used for creating new accounts.
 */
export class NewAccountDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordValidation, {message: 'Password needs to be stronger'})
    password!: string;

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match!' })
    confirmPassword!: string;
}

/**
 * Validator class used for logging in.
 */
export class LoginAccountDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordValidation)
    password!: string;
}