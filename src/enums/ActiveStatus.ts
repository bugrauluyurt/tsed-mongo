import { registerEnumType } from "type-graphql";

export enum ActiveStatus {
    NOT_ACTIVE = 0,
    ACTIVE = 1,
    ALL = 2,
}

registerEnumType(ActiveStatus, {
    name: "ActiveStatus",
    description: "ActiveStatus of a Project",
});
