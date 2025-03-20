import { PrismaClient, } from "@prisma/client";
import { Optional } from "../../utils/Optional";
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise";
import type { IUser } from "../interfaces/UserService";
import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { User } from "../../models/User";

let incrementable = 0

function incremental(): number {
    incrementable++
    return incrementable 
}

export class InMemoryUserService implements IUser {
  private users: Map<string, User> = new Map();

  async createUser(data: { username: string; password: string }): VPromise {
    if (this.users.has(data.username)) {
      throw new Error("User already exists");
    }
    this.users.set(data.username, {
        name: data.username,
        id: incrementable.toString() 
    });
  }

  async findByUsername(username: string): OptionalPromise<User> {
    return new Optional(this.users.get(username));
  }
}


export class PostgresConnectedUserService implements IUser{
    private client = new PrismaClient()
    async createUser(data: { username: string; password: string; }): VPromise {
      console.log("j")
        await this.client.user.create({
            data: {
                name: data.username, 
           }
       }) 
    }

    async findByUsername(username: string): OptionalPromise<User> {
      return new Optional(await this.client.user.findUnique({
        where: { name: username}
       }))
    }
}