import { Result } from "../results/result";

export interface IUseCase<I, O> {
    execute(input: I): Promise<Result<O>>;
}
