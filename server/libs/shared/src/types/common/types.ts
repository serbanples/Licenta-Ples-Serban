import { Request } from "express";
import { UserRoleEnum } from "../database/types";

export interface UserContextType {
    id: string;
    email: string;
    role: UserRoleEnum;
}

export interface RequestWrapper extends Request {
    user?: UserContextType
}


export type SuccessResponse = {
    success: boolean;
  }