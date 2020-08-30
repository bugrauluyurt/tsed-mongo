import { registerEnumType } from "type-graphql";

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

registerEnumType(Priority, {
    name: "Priority",
});
