import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerificationEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  verificationToken!: string;
}