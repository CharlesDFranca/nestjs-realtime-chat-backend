import { IdGenerator } from "@/shared/app/contracts/id-generator";
import { randomUUID } from "node:crypto";

export class IdGeneratorService implements IdGenerator {
    generate(): string {
        return randomUUID();
    }
}
