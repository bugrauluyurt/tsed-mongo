import { MaxLength, MinLength, Required, Property, Default } from "@tsed/common";
import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { CompanyUtils } from "./Company.utils";
import { ActiveStatus } from "../../enums/ActiveStatus";
import {
    ERROR_COMPANY_NAME_MISSING,
    ERROR_COMPANY_NAME_MIN_LENGTH,
    ERROR_COMPANY_NAME_MAX_LENGTH,
    ERROR_COMPANY_DOMAIN_NAME_MIN_LENGTH,
    ERROR_COMPANY_DOMAIN_NAME_MAX_LENGTH,
} from "../../errors/CompaniesError";
import { Schema } from "mongoose";
import * as mongoose from "mongoose";

@MongooseSchema()
export class Company {
    @ObjectID("id")
    _id: string;

    @MinLength(CompanyUtils.MIN_NAME)
    @MaxLength(CompanyUtils.MAX_NAME)
    @Required()
    @Description("Name of the company")
    companyName: string;

    @MinLength(CompanyUtils.MIN_DOMAIN_NAME)
    @MaxLength(CompanyUtils.MAX_DOMAIN_NAME)
    @Description("Domain of the company")
    domain: string;

    @Property()
    @Default(true)
    @Description("Shows if the company is active or not")
    active: number = ActiveStatus.ACTIVE;
}

// Schema Definition
export const CompanySchemaDefinition = {
    companyName: {
        type: String,
        required: [true, ERROR_COMPANY_NAME_MISSING],
        minLength: [CompanyUtils.MIN_NAME, ERROR_COMPANY_NAME_MIN_LENGTH],
        maxLength: [CompanyUtils.MAX_NAME, ERROR_COMPANY_NAME_MAX_LENGTH],
    },
    domain: {
        type: String,
        minLength: [CompanyUtils.MIN_DOMAIN_NAME, ERROR_COMPANY_DOMAIN_NAME_MIN_LENGTH],
        maxLength: [CompanyUtils.MAX_DOMAIN_NAME, ERROR_COMPANY_DOMAIN_NAME_MAX_LENGTH],
    },
    active: { type: Number, default: ActiveStatus.ACTIVE },
};

export const CompanySchema = new Schema(CompanySchemaDefinition);
export const CompanyModel = mongoose.model<Company & mongoose.Document>(CompanyUtils.MODEL_NAME, CompanySchema);
