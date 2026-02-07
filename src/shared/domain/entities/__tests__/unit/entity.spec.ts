import { Entity } from "../../entity";

class TestEntity extends Entity {
    constructor(id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
    }
}

describe("Entity Base", () => {
    const validId = "123";
    const now = new Date();
    const later = new Date(now.getTime() + 1000);

    it("should create an entity with valid values", () => {
        const entity = new TestEntity(validId, now, later);

        expect(entity.id).toBe(validId);
        expect(entity.createdAt.getTime()).toBe(now.getTime());
        expect(entity.updatedAt.getTime()).toBe(later.getTime());
    });

    it("should throw error if createdAt is after updatedAt", () => {
        const future = new Date(now.getTime() + 1000);

        expect(() => new TestEntity(validId, future, now)).toThrow(
            `Invalid entity dates: createdAt: (${future.toISOString()}) is after updatedAt: (${now.toISOString()})`,
        );
    });

    it("should allow updatedAt to be equal to createdAt", () => {
        const entity = new TestEntity(validId, now, now);

        expect(entity.createdAt.getTime()).toBe(now.getTime());
        expect(entity.updatedAt.getTime()).toBe(now.getTime());
    });

    it("should return true for entities with the same id", () => {
        const entity1 = new TestEntity("123", now, later);
        const entity2 = new TestEntity("123", now, later);

        expect(entity1.equals(entity2)).toBe(true);
    });

    it("should return false for entities with different ids", () => {
        const entity1 = new TestEntity("123", now, later);
        const entity2 = new TestEntity("456", now, later);

        expect(entity1.equals(entity2)).toBe(false);
    });

    it("should return false if other entity is null", () => {
        const entity1 = new TestEntity("123", now, later);

        expect(entity1.equals(null as any)).toBe(false);
    });

    it("should return false if other entity is undefined", () => {
        const entity1 = new TestEntity("123", now, later);

        expect(entity1.equals(undefined as any)).toBe(false);
    });

    it("should return true even if other entity has different dates but same id", () => {
        const entity1 = new TestEntity("123", now, later);
        const entity2 = new TestEntity("123", later, later);

        expect(entity1.equals(entity2)).toBe(true);
    });
});
