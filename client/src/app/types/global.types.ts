export interface UserContext {
  id: string;
  email: string;
  role: UserRoleEnum;
}

export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  MASTER = 'master'
}

export interface ValidationRules {
  required?: boolean;
  email?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number
}