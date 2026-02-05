export interface UnitOfWork {
    withTransation<T>(fn: () => Promise<T>): Promise<T>;
}
