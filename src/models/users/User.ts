import { Model, ObjectID, PreHook, Unique } from "@tsed/mongoose";
import { IgnoreProperty, MaxLength, MinLength, Property, Required } from "@tsed/common";
import * as _ from "lodash";
import { Description } from "@tsed/swagger";

export enum UserRole {
    ADMIN = "admin",
    BASIC = "basic",
}

@Model()
export class User {
    @ObjectID("id")
    _id: string;

    @Property()
    @Description("Name of the user")
    name: string;

    @MinLength(10)
    @MaxLength(100)
    @Unique()
    @Required()
    @Description("Email of the user")
    email: string;

    @IgnoreProperty()
    @Description("Password of the user")
    password: string;

    @Property()
    @Description("Phone number")
    phone: string;

    @Property()
    @Description("Address")
    address: string;

    @Property()
    @Description("Role")
    roles: UserRole[];

    @PreHook("save")
    static preSave(user: User, next) {
        if (_.isEmpty(user.roles)) {
            user.roles = [UserRole.BASIC];
        }
        next();
    }
}

// [SEED] Schema Definition
export const UserSchemaDefinition = {
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    roles: Array,
};
