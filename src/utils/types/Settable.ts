export class GetSet<V>{
    private v: V
    constructor(v: V) {
        this.v = v
    }

    public set value(v: V) {
        this.v = v
    }

    public get value(): V {
        return this.v
    }
}