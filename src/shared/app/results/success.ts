export class Success<T> {
    readonly ok = true;

    constructor(public readonly value: T) {}
}
