import type { SPromise } from "../../utils/types/customPromises/stringPromise"
import type { VPromise } from "../../utils/types/customPromises/VPromise"
import type { strings } from "../../utils/types/strings"

export interface IAgentsService {
    create(userId: string, agentName: string): SPromise 
    delete(userId: string, agentName: string): VPromise
    getUserAgents(userId: string): Promise<strings>
}