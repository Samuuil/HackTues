import { Optional } from "../Optional";




export class IdOrUsernameQuery<Id> {
    readonly id: Optional<Id>;
    readonly username: Optional<string>;
    constructor(username: Optional<string> = new Optional<string>(), id: Optional<Id> = new Optional<Id>()) {
        if (username.isNone() && id.isNone()) {
            throw new Error("Either username or id must be provided.");
        }
        this.username = username;
        this.id = id;
    }


    ifId<T>(handler:(v: Id) => T): T | undefined{
        return this.id.ifNotNone((v) => handler(v))
    }
    



    ifUsername(handler:(v: string) => void){
        this.username.ifNotNone((v) => handler(v))
    }
}