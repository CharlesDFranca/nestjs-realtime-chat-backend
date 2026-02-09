import { Role } from "@/conversation/domain/value-objects/participant-role.vo";
import { Participant } from "../../participant.entity";

describe("Participant Entity", () => {
    const baseProps = {
        userId: "user-1",
        name: "John Doe",
        role: "MEMBER" as "MEMBER" | "ADMIN",
    };

    const createParticipant = (
        overrides?: Partial<typeof baseProps>,
    ): Participant => {
        return Participant.create("participant-1", {
            ...baseProps,
            ...overrides,
        });
    };

    describe("creation", () => {
        it("should create a participant with correct initial values", () => {
            const participant = createParticipant();

            expect(participant.userId).toBe("user-1");
            expect(participant.name.value).toBe("John Doe");
            expect(participant.role.is(Role.MEMBER)).toBe(true);
            expect(participant.isOnline).toBe(false);
            expect(participant.isTyping).toBe(false);
        });

        it("should allow creation with ADMIN role", () => {
            const participant = createParticipant({ role: "ADMIN" });

            expect(participant.role.is(Role.ADMIN)).toBe(true);
        });
    });

    describe("typing state", () => {
        it("should start typing", () => {
            const participant = createParticipant();

            participant.startTyping();

            expect(participant.isTyping).toBe(true);
        });

        it("should stop typing", () => {
            const participant = createParticipant();

            participant.startTyping();
            participant.stopTyping();

            expect(participant.isTyping).toBe(false);
        });

        it("should be idempotent when starting typing twice", () => {
            const participant = createParticipant();

            participant.startTyping();
            const updatedAtAfterFirst = participant.updatedAt;

            participant.startTyping();

            expect(participant.isTyping).toBe(true);
            expect(participant.updatedAt).toEqual(updatedAtAfterFirst);
        });

        it("should be idempotent when stopping typing while not typing", () => {
            const participant = createParticipant();
            const updatedAtBefore = participant.updatedAt;

            participant.stopTyping();

            expect(participant.isTyping).toBe(false);
            expect(participant.updatedAt).toEqual(updatedAtBefore);
        });
    });

    describe("online status", () => {
        it("should change status to online", () => {
            const participant = createParticipant();

            participant.changeStatusToOnline();

            expect(participant.isOnline).toBe(true);
        });

        it("should change status to offline", () => {
            const participant = createParticipant();

            participant.changeStatusToOnline();
            participant.changeStatusToOffline();

            expect(participant.isOnline).toBe(false);
        });

        it("should be idempotent when setting online twice", () => {
            const participant = createParticipant();

            participant.changeStatusToOnline();
            const updatedAtAfterFirst = participant.updatedAt;

            participant.changeStatusToOnline();

            expect(participant.isOnline).toBe(true);
            expect(participant.updatedAt).toEqual(updatedAtAfterFirst);
        });

        it("should be idempotent when setting offline while already offline", () => {
            const participant = createParticipant();
            const updatedAtBefore = participant.updatedAt;

            participant.changeStatusToOffline();

            expect(participant.isOnline).toBe(false);
            expect(participant.updatedAt).toEqual(updatedAtBefore);
        });
    });

    describe("role transitions", () => {
        it("should promote participant to admin", () => {
            const participant = createParticipant();

            participant.toAdmin();

            expect(participant.role.is(Role.ADMIN)).toBe(true);
        });

        it("should demote participant to member", () => {
            const participant = createParticipant({ role: "ADMIN" });

            participant.toMember();

            expect(participant.role.is(Role.MEMBER)).toBe(true);
        });

        it("should be idempotent when promoting an admin to admin again", () => {
            const participant = createParticipant({ role: "ADMIN" });
            const updatedAtBefore = participant.updatedAt;

            participant.toAdmin();

            expect(participant.role.is(Role.ADMIN)).toBe(true);
            expect(participant.updatedAt).toEqual(updatedAtBefore);
        });

        it("should be idempotent when demoting a member to member again", () => {
            const participant = createParticipant();
            const updatedAtBefore = participant.updatedAt;

            participant.toMember();

            expect(participant.role.is(Role.MEMBER)).toBe(true);
            expect(participant.updatedAt).toEqual(updatedAtBefore);
        });
    });

    describe("updatedAt behavior", () => {
        it("should update updatedAt when state changes", async () => {
            const participant = createParticipant();
            const initialUpdatedAt = participant.updatedAt;

            // small delay to avoid same timestamp edge cases
            await new Promise((r) => setTimeout(r, 2));

            participant.startTyping();

            expect(participant.updatedAt.getTime()).toBeGreaterThan(
                initialUpdatedAt.getTime(),
            );
        });

        it("should not update updatedAt when no state changes", () => {
            const participant = createParticipant();
            const initialUpdatedAt = participant.updatedAt;

            participant.stopTyping();
            participant.changeStatusToOffline();
            participant.toMember();

            expect(participant.updatedAt).toEqual(initialUpdatedAt);
        });
    });
});
