import type { VPromise } from "../../utils/types/customPromises/VPromise"
import type { strings } from "../../utils/types/strings"

export interface IAgentsService {
    create(userId: string, agentName: string): VPromise
    delete(userId: string, agentName: string): VPromise
    getUserAgents(userId: string): Promise<strings>
}