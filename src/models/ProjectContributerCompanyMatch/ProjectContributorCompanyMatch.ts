import { Company } from "../companies/Company";
import { Required } from "@tsed/common";
import { MongooseSchema, ObjectID, Indexed, Ref } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Schema } from "mongoose";
import * as mongoose from "mongoose";
import { Project } from "../projects/Project";
import { CompanyUtils } from "../companies/Company.utils";
import { ERROR_COMPANY_MISSING, ERROR_NO_PROJECT } from "../../errors/ProjectsError";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectUtils } from "../projects/Project.utils";
import { ProjectContributorCompanyMatchUtils } from "./ProjectContributorCompanyMatch.utils";

@MongooseSchema()
export class ProjectContributorCompanyMatch {
    @ObjectID("id")
    _id: string;

    @Indexed()
    @Required()
    @Description("Project which is being contributed by the company")
    project: Ref<Project>;

    @Indexed()
    @Required()
    @Ref(Company)
    @Description("Company which contributes to the project")
    contributorCompany: Ref<Company>;
}

// Schema Definition
export const ProjectContributorCompanyMatchSchemaDefinition = {
    project: {
        type: Schema.Types.ObjectId,
        ref: ProjectUtils.MODEL_NAME,
        required: [true, ERROR_NO_PROJECT],
        validate: getForeignKeyValidator.call(this, ProjectUtils.MODEL_NAME, ERROR_NO_PROJECT),
        index: true,
    },
    contributorCompany: {
        type: Schema.Types.ObjectId,
        ref: CompanyUtils.MODEL_NAME,
        required: [true, ERROR_COMPANY_MISSING],
        validate: getForeignKeyValidator.call(this, CompanyUtils.MODEL_NAME, ERROR_COMPANY_MISSING),
        index: true,
    },
};

export const ProjectContributorCompanyMatchSchema = new Schema(ProjectContributorCompanyMatchSchemaDefinition, {
    versionKey: false,
});
export const ProjectContributorCompanyMatchModel = mongoose.model(
    ProjectContributorCompanyMatchUtils.MODEL_NAME,
    ProjectContributorCompanyMatchSchema
);
