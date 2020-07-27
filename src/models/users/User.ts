import { MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Indexed, MongooseSchema, ObjectID, Ref, Unique } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import * as mongoose from "mongoose";
import { Company, CompanySchemaDefinition } from "../companies/Company";
import { CompanyUtils } from "../companies/Company.utils";
import { UserRole, UserRolesAll } from "./UserRole";
import { UserUtils } from "./User.utils";
import {
    ERROR_USER_NAME_MAX_LENGTH,
    ERROR_USER_NAME_MIN_LENGTH,
    ERROR_USER_EMAIL_MIN_LENGTH,
    ERROR_USER_EMAIL_MAX_LENGTH,
    ERROR_USER_EMAIL_MISSING,
    ERROR_USER_PASSWORD_MISSING,
    ERROR_USER_COMPANY_MISSING,
} from "../../errors/UsersError";
import { getForeignKeyValidator } from "../../utils/foreignKeyHelper";
import { IUser } from "../../interfaces/User/User.interface";
import { UserCompanyRole, UserCompanyRolesAll } from "./UserCompanyRole";

@MongooseSchema()
export class User {
    @ObjectID("id")
    _id: string;

    @Property()
    @MinLength(UserUtils.USER_NAME_MIN_LENGTH)
    @MaxLength(UserUtils.USER_NAME_MAX_LENGTH)
    @Description("Name of the user")
    name: string;

    @MinLength(UserUtils.USER_EMAIL_MIN_LENGTH)
    @MaxLength(UserUtils.USER_EMAIL_MAX_LENGTH)
    @Indexed()
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
    @Required()
    @Ref(Company)
    companies: Ref<Company>[] = [];

    @Property()
    @Description("List of user roles")
    roles: UserRole[] = [UserRole.GENERAL];

    @Property()
    @Description("List of user company roles")
    companyRoles: UserCompanyRole[] = [UserCompanyRole.COMPANY_MEMBER];
}

// Schema Definition
export const UserSchemaDefinition = {
    name: {
        type: String,
        minLength: [UserUtils.USER_NAME_MIN_LENGTH, ERROR_USER_NAME_MIN_LENGTH],
        maxLength: [UserUtils.USER_NAME_MIN_LENGTH, ERROR_USER_NAME_MAX_LENGTH],
    },
    // Email validation is done at authentication controller level
    email: {
        type: String,
        minLength: [UserUtils.USER_EMAIL_MIN_LENGTH, ERROR_USER_EMAIL_MIN_LENGTH],
        maxLength: [UserUtils.USER_EMAIL_MIN_LENGTH, ERROR_USER_EMAIL_MAX_LENGTH],
        required: [true, ERROR_USER_EMAIL_MISSING],
        unique: true,
    },
    // Password validation is done at authentication controller level
    password: { type: String, required: [true, ERROR_USER_PASSWORD_MISSING] },
    phone: String,
    address: String,
    companies: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: CompanyUtils.MODEL_NAME,
                validate: getForeignKeyValidator.call(this, CompanyUtils.MODEL_NAME, ERROR_USER_COMPANY_MISSING),
            },
        ],
        required: [true, ERROR_USER_COMPANY_MISSING],
    },
    roles: {
        type: [
            {
                type: String,
                enum: UserRolesAll,
            },
        ],
        default: [UserRole.GENERAL],
    },
    companyRoles: {
        type: [
            {
                type: String,
                enum: UserCompanyRolesAll,
            },
        ],
        default: [UserCompanyRole.COMPANY_MEMBER],
    },
};
// @TODO Add "pre" save hook which updates a dateUpdated value on user object

export const UserSchema = new mongoose.Schema(UserSchemaDefinition, { versionKey: false });
export const UserModel = mongoose.model<IUser & mongoose.Document>(UserUtils.MODEL_NAME, UserSchema);
