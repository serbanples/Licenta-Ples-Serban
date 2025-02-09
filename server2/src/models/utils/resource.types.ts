import { ModelType } from "./types";

/** Accout model type used for mongo */
export interface AccountModelType extends ModelType {
  email: string;
  username: string;
  password: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  accountVerificationToken: string;
  passwordResetToken: string;
  accessToken: string;
}

/** user role enum with all user roles available */
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  MASTER = 'master'
}