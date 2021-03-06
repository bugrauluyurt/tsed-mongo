import { registerEnumType } from "type-graphql";

export enum TeamRole {
    PROJECT_ADMIN = "project_admin",
    WRITE_COMMENT = "write_comment",
    COMMENT_ONLY = "comment_only",
    GUEST = "guest",
}

registerEnumType(TeamRole, {
    name: "TeamRole",
});
