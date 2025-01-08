import { UserRoleEnum } from "../database/types";

export interface UserContextType {
    id: string;
    email: string;
    role: UserRoleEnum;
}