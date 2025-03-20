import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { IAgentsService } from "../interfaces/Agents";
import type { strings } from "../../utils/types/strings";

export class InMemoryAgents implements IAgentsService {
    private userAgents: Map<string, Set<string>> = new Map();

    async create(userId: string): VPromise {
        if (!this.userAgents.has(userId)) {
            this.userAgents.set(userId, new Set());
        }
        const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.userAgents.get(userId)!.add(agentId);
    }

    async delete(userId: string, agentName: string): VPromise {
        if (!this.userAgents.has(userId)) {
        }
        this.userAgents.delete(userId);
    }

    async getUserAgents(userId: string): Promise<strings> {
        if (!this.userAgents.has(userId)) {
            return [];
        }
        return Array.from(this.userAgents.get(userId)!);
    }
}