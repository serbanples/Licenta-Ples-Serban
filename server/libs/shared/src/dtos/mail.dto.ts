import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * Verification email class used to valdiate the data coming to mailter service.
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