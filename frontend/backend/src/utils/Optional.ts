
type None = null | undefined

type TryConfig<ifNoneReturn, IfNotNoneReturn, Y> = {
    ifNone: () => IfNotNoneReturn,
    ifNotNone: (v: Y) => IfNotNoneReturn
}

type TryConfigWithTheSameReturn<T,Y> = TryConfig<T,T,Y>

class Resultable<T>{
    readonly else: T
    constructor(v: T) {
        this.else = v
    }

}


export class Optional<T> {
  private v: T | None;
  constructor(v: T | None = null) {
    this.v = v;
  }

  isNone(): boolean {
    return this.v === null || this.v === undefined;
  }

  unpack(errorMsg: string): T {
    if (this.v === null || this.v === undefined) {
      throw new Error(errorMsg);
    }
    return this.v as T;
  }

  unpackWithDefault(d: T): T {
    if (this.isNone()) {
      return d;
    }
    return this.v as T;
  }

  ifNotNone<Y>(handler: (v: T) => Y): Y | undefined {
    if (!this.isNone()) {
      return handler(this.v as T);
    }
  }

  ifNone<Y>(handler: () => Y):Y | undefined {
    if (this.isNone()) {
      return handler()
    }
  }

  try(obj: TryConfigWithTheSameReturn<void, T>) {
    if (this.isNone()) {
      obj.ifNone();
    } else {
      obj.ifNotNone(this.v as T);
    }
  }

  tryReturningTheSameType<Y>(handlers: TryConfigWithTheSameReturn<Y, T>) {
    if (this.isNone()) {
      return handlers.ifNone();
    } else {
      return handlers.ifNotNone(this.v as T);
    }
  }

  unpackWithDivergingHandlerReturningUnion<V>(
    divergingHandler: () => V
  ): V | T {
    if (this.isNone()) {
      return divergingHandler();
    }
    return this.v as V;
  }
}