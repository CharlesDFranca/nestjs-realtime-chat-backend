export abstract class ValueObject<T> {
    protected readonly _value: T;

    constructor(value: T) {
        this.validate(value);
        this._value = value;
    }

    public get value(): T {
        return this._value;
    }

    public equals(other: ValueObject<T>): boolean {
        if (other === null) return false;

        return this._value === other.value;
    }

    protected abstract validate(value: T): void;
}
