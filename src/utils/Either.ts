type LeftOrRight = "left" | "right";

class EitherValue<T> {
  readonly v: T;
  readonly type: LeftOrRight;
  constructor(v: T, type: LeftOrRight) {
    this.v = v;
    this.type = type;
  }
}

class Left<T> extends EitherValue<T> {
  constructor(v: T) {
    super(v, "left");
  }
}

class Right<T> extends EitherValue<T> {
  constructor(v: T) {
    super(v, "right");
  }
}

class Either<L, R> {
  private v: Left<L> | Right<R>;

  constructor(v: Left<L> | Right<R>) {
    this.v = v;
  }

  isLeft(): boolean {
    return this.v.type === "left";
  }

  isRight(): boolean {
    return this.v.type === "right";
  }

  getLeft(): L {
    if (this.isLeft()) {
      return (this.v as Left<L>).v;
    }
    throw new Error("Cannot get Left value from Right");
  }

  getRight(): R {
    if (this.isRight()) {
      return (this.v as Right<R>).v;
    }
    throw new Error("Cannot get Right value from Left");
  }

  fold<T>(leftFn: (l: L) => T, rightFn: (r: R) => T): T {
    return this.isLeft() ? leftFn(this.getLeft()) : rightFn(this.getRight());
  }

  map<T>(fn: (r: R) => T): Either<L, T> {
    if (this.isRight()) {
      return new Either<L, T>(new Right<T>(fn(this.getRight())));
    }
    return this as unknown as Either<L, T>;
  }

  mapLeft<T>(fn: (l: L) => T): Either<T, R> {
    if (this.isLeft()) {
      return new Either<T, R>(new Left<T>(fn(this.getLeft())));
    }
    return this as unknown as Either<T, R>;
  }

  static left<L, R>(l: L): Either<L, R> {
    return new Either<L, R>(new Left<L>(l));
  }

  static right<L, R>(r: R): Either<L, R> {
    return new Either<L, R>(new Right<R>(r));
  }
}
