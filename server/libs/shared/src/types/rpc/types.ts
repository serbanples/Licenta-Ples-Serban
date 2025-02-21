import { UserContextType } from "../common/types"

export type AutzAuthorizedType = {
    usercontext: UserContextType,
    resource: string,
    action: string,
}

export type WithContext<T> = {
    userContext: UserContextType;
    data: T
}