import { ModelType } from "./types";

/** Accout model type used for mongo */
export interface AccountModelType extends ModelType {
  username: string;
  password: string;
  email: string;
  createdAt: Date;   
  role: UserRoleEnum;
}

/** user role enum with all user roles available */
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  MASTER = 'master'
}