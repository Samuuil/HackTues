import { InMemoryAgents } from "./services/implementations/Agents"
import { Auth } from "./services/implementations/Auth"
import { DataService, InMemoryMemoizationStorage } from "./services/implementations/Data"
import { RoomsService } from "./services/implementations/Room"
import { InMemoryUserService, PostgresConnectedUserService } from "./services/implementations/User"
import type { IAgentsService } from "./services/interfaces/Agents"
import type { IAuth } from "./services/interfaces/Authentication"
import type { IDataService } from "./services/interfaces/Data"
import type { IRoomsService } from "./services/interfaces/Room"
import type { IUser } from "./services/interfaces/UserService"

const agentsService = new InMemoryAgents()
const memoization = new  InMemoryMemoizationStorage()

export const context: {
    authService: IAuth,
    agentsService: IAgentsService,
    roomsService: IRoomsService
    userService: IUser
    dataService: IDataService
} = {
    agentsService: agentsService,
    userService: new PostgresConnectedUserService(),
    authService: new Auth(agentsService),
    roomsService: new RoomsService(),
    dataService: new DataService(memoization)
}

