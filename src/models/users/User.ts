import { MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Model, ObjectID, PreHook, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import * as _ from "lodash";
import { Schema } from "mongoose";
import { Company } from "../companies/Company";
import { CompanyUtils } from "../companies/Company.utils";
import { UserRole } from "./UserRole";

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

    @Description("Password of the user")
    password: string;

    @Property()
    @Description("Phone number")
    phone: string;

    @Property()
    @Description("Address")
    address: string;

    @Description("Company ids that user belongs to. Populated field")
    @Ref(Company)
    companies: Ref<Company>[] = [];

    @Property()
    @Description("List of user roles")
    roles: UserRole[];

    @PreHook("save")
    static preSave(user: User, next) {
        if (_.isEmpty(user.roles)) {
            user.roles = [UserRole.BASIC];
        }
        if (_.isEmpty(user.companies)) {
            user.companies = [];
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
    companies: [{ type: Schema.Types.ObjectId, ref: CompanyUtils.MODEL_NAME }],
    roles: { type: Array, default: [UserRole.BASIC] },
};
