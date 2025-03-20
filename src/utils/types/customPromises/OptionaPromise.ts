import type { Optional } from "../../Optional";
import type { Something } from "../GenricThatIsSomething";

export type OptionalPromise<T extends Something<unknown>> = Promise<Optional<Exclude<T, null | undefined>>>


type g = OptionalPromise<Something<null>>