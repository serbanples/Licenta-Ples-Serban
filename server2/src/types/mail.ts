import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyAccountType {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  verificationToken!: string;
}