export class Failure<E> {
    readonly ok = false;

    constructor(public readonly value: E) {}
}
