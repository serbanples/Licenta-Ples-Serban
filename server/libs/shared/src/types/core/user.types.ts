import { UserModel } from "@app/database/models/user.model";
import { BaseBrowseFilter, BaseCreateType, BaseDeleteType, BaseUpdateType } from "./general.types";

export interface UserBrowseFilter extends BaseBrowseFilter {
    
}

export interface UserCreateType extends BaseCreateType {
    email: string;
    fullName: string;
}

export interface UserUpdateType extends BaseUpdateType<Partial<UserModel>> {}

export interface UserDeleteType extends BaseDeleteType {
    email: string;
}