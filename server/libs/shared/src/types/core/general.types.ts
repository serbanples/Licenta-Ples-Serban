import { with_pagination, with_populate, with_text } from "../database/types";

export interface BaseBrowseFilter extends with_populate, with_text, with_pagination {
    id?: string;
}

export interface BaseCreateType {}

export interface BaseUpdateType<T> {
    id: string;
    updateBody: T;
}

export interface BaseDeleteType {
    id?: string;
}