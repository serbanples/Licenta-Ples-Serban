import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * Verification email class used to valdiate the data coming to mailer service.
 */
export class VerificationEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  verificationToken!: string;
}

/**
 * Reset password email class used to valdiate the data coming to mailer service.
 */
export class ResetPasswordEmail {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  resetToken!: string;
}