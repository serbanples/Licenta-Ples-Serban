export enum UserRoleEnum {
    USER = 'user',
    ADMIN = 'admin',
    MASTER = 'master',
}

export type PopulateOpts = {
    path: string;
    model?: ModelNameEnum;
    select: string;
}[]

export enum ModelNameEnum {
    USER = 'User',
}

export interface QueryPaginationFilter {
    fromItem?: number;
    pageSize?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
}

export interface PaginationFilter {
    fromItem: number;
    pageSize: number;
    orderBy: string;
    orderDir: 'asc' | 'desc';
}

export interface ResourceWithPagination<T> {
    result: T[];
    pagination: {
        fromItem: number;
        perPage: number;
        count: number;
        totalPages: number;
        totalCount: number;
    }
}

export interface with_text {
    text?: string;
}

export interface with_populate {
    populate?: boolean;
}

export interface with_pagination {
    pagination?: QueryPaginationFilter;
}