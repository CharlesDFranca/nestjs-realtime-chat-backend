import { InvalidParticipantRoleError } from "@/conversation/domain/errors/invalid-participant-role.error";
import { ParticipantRole, Role } from "../../participant-role.vo";

describe("ParticipantRole VO", () => {
    describe("create", () => {
        it("should create a ParticipantRole with valid MEMBER role", () => {
            const role = ParticipantRole.create(Role.MEMBER);
            expect(role.value).toBe(Role.MEMBER);
        });

        it("should create a ParticipantRole with valid ADMIN role", () => {
            const role = ParticipantRole.create(Role.ADMIN);
            expect(role.value).toBe(Role.ADMIN);
        });

        it("should throw InvalidParticipantRoleError for invalid role", () => {
            expect(() => {
                // @ts-expect-error
                ParticipantRole.create("INVALID_ROLE");
            }).toThrow(InvalidParticipantRoleError);
        });
    });

    describe("toAdmin", () => {
        it("should convert any role to ADMIN", () => {
            const role = ParticipantRole.create(Role.MEMBER);
            const adminRole = role.toAdmin();
            expect(adminRole.value).toBe(Role.ADMIN);
        });
    });

    describe("toMember", () => {
        it("should convert any role to MEMBER", () => {
            const role = ParticipantRole.create(Role.ADMIN);
            const memberRole = role.toMember();
            expect(memberRole.value).toBe(Role.MEMBER);
        });
    });

    describe("is", () => {
        it("should return true if role matches", () => {
            const role = ParticipantRole.create(Role.MEMBER);
            expect(role.is(Role.MEMBER)).toBe(true);
            expect(role.is(Role.ADMIN)).toBe(false);
        });

        it("should return false if role is null or undefined", () => {
            const role = ParticipantRole.create(Role.MEMBER);

            // @ts-expect-error
            expect(role.is(undefined)).toBe(false);
            // @ts-expect-error
            expect(role.is(null)).toBe(false);
        });
    });
});
