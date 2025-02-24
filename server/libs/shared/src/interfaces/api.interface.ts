import { DeleteResult } from "mongoose";
import { ResourceWithPagination, UserContextType } from "../types";
import { BaseBrowseFilter, BaseCreateType, BaseDeleteType, BaseUpdateType } from "../types/core/general.types";

export interface IApi<T> {
    browse(userContext: UserContextType, filter: BaseBrowseFilter): Promise<ResourceWithPagination<T>>;
    create(userContext: UserContextType, newDocument: BaseCreateType): Promise<T>;
    update(userContext: UserContextType, updatedDocument: BaseUpdateType<any>): Promise<T>;
    delete(userContext: UserContextType, deletedDocument: BaseDeleteType): Promise<DeleteResult>;
}