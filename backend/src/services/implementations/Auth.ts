import type { SPromise } from "../../utils/types/customPromises/stringPromise";
import type { strings } from "../../utils/types/strings";
import type { IAgentsService } from "../interfaces/Agents";
import type { IAuth } from "../interfaces/Authentication";

export class Auth implements IAuth{ //TODO: (importance level 1) replace with the microservice when done 
    private agentsService: IAgentsService 
    constructor(agentsService : IAgentsService) {
        this.agentsService = agentsService
    }
    
    async isValid(token: string): Promise<boolean> {
        // if(externalValidator.checkTokenValidity() || this.AgentsService.)
        
        return true
    }

    async getUserTokens(userId: string): Promise<strings> {
        // return externalService.getUserTokens(userId)
        return ["1"]
    }

     async issueToken(userId: string): Promise<string> {
        return "huhu"
    }

    async getUserPassword(userId: string): SPromise {
        return "f"
    }
}
