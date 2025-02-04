import mongoose from "mongoose";

/** mongo populate options */
export type PopulateOpts = {
    path: string; // key to populate
    model?: ModelNameEnum, // model to search data for
    select: string 
}[];

/** enum with all models in app */
export enum ModelNameEnum {
    ACCOUNT = 'account'
}

/** pagination filter for mongo paginated query */
export interface PaginationFilter {
    fromItem: number;
    pageSize: number;
    orderBy: string;
    orderDir: 'asc' | 'desc';
}

/** generic model type used to include id instead of _id */
export interface ModelType extends mongoose.Document {
    id: string;
}