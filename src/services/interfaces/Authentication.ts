import type { VPromise } from "../../utils/types/customPromises/VPromise"
import type { strings } from "../../utils/types/strings"

export interface IAuth{
    isValid(token: string): Promise<boolean>
    issueToken(userId: string): Promise<string> 
    getUserTokens(userId: string): Promise<strings>
    getUserPassword(userId: string): Promise<string>
    
}