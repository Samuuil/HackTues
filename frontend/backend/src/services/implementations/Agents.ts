import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { IAgentsService } from "../interfaces/Agents";
import type { strings } from "../../utils/types/strings";
import { PrismaClient } from "@prisma/client";
import type { SPromise } from "../../utils/types/customPromises/stringPromise";

export class InMemoryAgents implements IAgentsService {

    private client = new PrismaClient()
    
    async create(userId: string, agentName: string): SPromise {
        return  (await this.client.agent.create({
            data: {
                name: agentName,
                userId: userId,
                value: "h"
           } 
        })).value
    }

    async delete(userId: string,agentName: string): VPromise {
        await this.client.agent.deleteMany({
            where: {
                name: agentName,
                userId: userId
            }
        })
    }

    async getUserAgents(userId: string): Promise<strings> {
        return (await this.client.agent.findMany({
            where: {
                userId: userId
            }
        })).map(t => t.value)
    }
}