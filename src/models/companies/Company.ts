import { MaxLength, MinLength, Required, Property, Default } from "@tsed/common";
import { Model, ObjectID } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { CompanyUtils } from "./Company.utils";
import { ActiveStatus } from "../../enums/activeStatus";

@Model()
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
    active: number;
}

// [SEED] Schema Definition
export const CompanySchemaDefinition = {
    companyName: String,
    domain: String,
    active: { type: Number, default: ActiveStatus.ACTIVE },
};
