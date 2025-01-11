import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

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
    @Matches(passwordValidation)
    password!: string;
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