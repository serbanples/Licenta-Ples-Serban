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