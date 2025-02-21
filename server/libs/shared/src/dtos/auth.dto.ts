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
    fullName!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordValidation, { message: 'Password needs to be stronger' })
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
    @Matches(passwordValidation, { message: 'Invalid password' })
    password!: string;
}

/**
 * Validator class used for verify account request.
 */
export class VerificationTokenDto {
    @IsString()
    @IsNotEmpty()
    verificationToken!: string;
}

/**
 * Validator class used for reset password request.
 */
export class RequestResetPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;
}

/**
 * Validator class used for reset password request.
 */
export class ResetPasswordFormDto {
    @IsString()
    @IsNotEmpty()
    resetToken!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordValidation, {message: 'Password needs to be stronger'})
    password!: string;

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match!' })
    confirmPassword!: string;
}