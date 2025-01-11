import { UserContextType } from "../common/types"

export type AutzAuthorizedType = {
    usercontext: UserContextType,
    resource: string,
    action: string,
}