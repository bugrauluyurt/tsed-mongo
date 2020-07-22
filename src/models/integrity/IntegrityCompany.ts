import { Required } from "@tsed/common";
import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Schema, HookNextFunction } from "mongoose";
import * as mongoose from "mongoose";
import { IntegrityUtils } from "./Integrity.utils";
import { ERROR_NO_DATE } from "../../errors/DateError";
import { ERROR_NO_COMPANY_ID } from "../../errors/CompaniesError";

@MongooseSchema()
export class IntegrityCompany {
    @ObjectID("id")
    _id: string;

    @Required()
    @Description(
        "Projects, projectSections, milestones are going to be deleted under this companyId during next planned job."
    )
    @ObjectID("id")
    companyId: string;

    @Description("Storage date")
    date: Date = new Date();
}

// Schema Definition
export const IntegrityCompanySchemaDefinition = {
    companyId: {
        type: Schema.Types.ObjectId,
        required: [true, ERROR_NO_COMPANY_ID],
    },
    date: Date,
};

export const IntegrityCompanySchema = new Schema(IntegrityCompanySchemaDefinition, { versionKey: false });
// Hooks
IntegrityCompanySchema.pre<IntegrityCompany & mongoose.Document>("save", async function (next: HookNextFunction) {
    if (!this.date || !(this.date instanceof Date)) {
        this.date = new Date();
    }
    next();
});

export const IntegrityCompanyModel = mongoose.model<IntegrityCompany & mongoose.Document>(
    IntegrityUtils.MODEL_NAME_COMPANY,
    IntegrityCompanySchema
);
