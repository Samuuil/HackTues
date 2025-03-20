import type { User } from "../../models/User";
import type { Optional } from "../../utils/Optional";
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise";
import type { IGuardedService } from "../interfaces/GuardedService";

export class Guarded implements IGuardedService{
    async get(id: Optional<string>): OptionalPromise<User[]> {
        return []
    }
} 