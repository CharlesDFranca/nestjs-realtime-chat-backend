import { ApplicationError } from "../errors/application.error";
import { Failure } from "./failure";
import { Success } from "./success";

export type Result<T, E = ApplicationError> = Success<T> | Failure<E>;

export const success = <T>(value: T) => new Success(value);
export const failure = <E>(error: E) => new Failure(error);
