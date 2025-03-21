import type { User } from "../../models/User"
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise"
import type { VPromise } from "../../utils/types/customPromises/VPromise"

export interface IUser{
    findByUsername(username: string): OptionalPromise<User> 
    createUser(data: { username: string, password: string }): VPromise
}