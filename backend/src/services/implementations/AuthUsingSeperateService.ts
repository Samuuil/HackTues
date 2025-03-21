import type { IAuth } from "../interfaces/Authentication";
import {client} from "../../../../auther/src/index"
import type { strings } from "../../utils/types/strings";


export class AuthUsingMicroservice implements IAuth {
    private client = client("http://localhost:3000")
    private token: string = await this.client.auth.login.post({
        username: "admin",
        password: "password"
    })
    isValid(token: string): Promise<boolean> {
        this.client.auth.validity.get({
            headers: {
                "X-Session-Id": this.token
           }
       }) 
    }
    getUserPassword(userId: string): Promise<string> {
        
    }

    getUserTokens(userId: string): Promise<strings> {
        return ["huhu"]
    }

    issueToken(userId: string): Promise<string> {
        
    }

}