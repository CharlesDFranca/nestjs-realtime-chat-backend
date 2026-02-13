export interface UnitOfWork {
    withTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
