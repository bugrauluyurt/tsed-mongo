import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Company } from "../companies/Company";
import * as mongoose from "mongoose";
import { Schema, HookNextFunction } from "mongoose";
import { CompanyUtils } from "../companies/Company.utils";
import { ProjectTypeUtils } from "../projectTypes/ProjectType.utils";
import { ProjectSection } from "../projectSections/ProjectSection";
import { ProjectSectionsUtils } from "../projectSections/ProjectSection.utils";
import { ProjectType } from "../projectTypes/ProjectType";
import { getForeignKeyValidator } from "../../utils/foreignKeyHelper";
import { ProjectUtils } from "./Project.utils";
import {
    ERROR_COMPANY_MISSING,
    ERROR_PROJECT_NAME_MAX_LENGTH,
    ERROR_PROJECT_NAME_MIN_LENGTH,
    ERROR_PROJECT_NAME_MISSING,
    ERROR_PROJECT_TYPE_MISSING,
    ERROR_NOT_VALID_PROJECT_TYPE,
    ERROR_NOT_VALID_PROJECT_SECTION,
} from "../../errors/ProjectsError";
import { ActiveStatus } from "../../enums/ActiveStatus";
import {
    ProjectContributorCompanyMatchModel,
    ProjectContributorCompanyMatch,
} from "../projectContributerCompanyMatch/projectContributorCompanyMatch";
import * as _ from "lodash";
import { ExpectationFailed } from "ts-httpexceptions";
import { ERROR_PROJECT_MATCH_NOT_CREATED } from "../../errors/ProjectContributorCompanyMatch";

@MongooseSchema()
export class Project {
    @ObjectID("id")
    _id: string;

    @Indexed()
    @Required()
    @Ref(Company)
    @Description("Company which project belongs to")
    company: Ref<Company>;

    @Property()
    @Required()
    projectName: string;

    @Ref(ProjectSection)
    @Description("List of project sections. ProjectSection model")
    projectSections: Ref<ProjectSection>[] = []; // should be populated, not-expensive

    @Required()
    @Ref(ProjectType)
    @Description("Project's type")
    projectType: Ref<ProjectType>; // should be populated, not-expensive

    @Property()
    @Description("Active status indicator")
    active = 1;
}

// Schema Definition
export const ProjectSchemaDefinition = {
    company: {
        type: Schema.Types.ObjectId,
        ref: CompanyUtils.MODEL_NAME,
        required: [true, ERROR_COMPANY_MISSING],
        validate: getForeignKeyValidator.call(this, CompanyUtils.MODEL_NAME, ERROR_COMPANY_MISSING),
        index: true,
    },
    projectName: {
        type: String,
        required: [true, ERROR_PROJECT_NAME_MISSING],
        minLength: [2, ERROR_PROJECT_NAME_MIN_LENGTH],
        maxLength: [100, ERROR_PROJECT_NAME_MAX_LENGTH],
    },
    projectSections: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: ProjectSectionsUtils.MODEL_NAME,
                validate: getForeignKeyValidator.call(
                    this,
                    ProjectSectionsUtils.MODEL_NAME,
                    ERROR_NOT_VALID_PROJECT_SECTION
                ),
            },
        ],
        default: [],
    },
    projectType: {
        type: Schema.Types.ObjectId,
        ref: ProjectTypeUtils.MODEL_NAME,
        required: [true, ERROR_PROJECT_TYPE_MISSING],
        validate: getForeignKeyValidator.call(this, ProjectTypeUtils.MODEL_NAME, ERROR_NOT_VALID_PROJECT_TYPE),
    },
    active: { type: Number, default: ActiveStatus.ACTIVE },
};

export const ProjectSchema = new Schema(ProjectSchemaDefinition, { versionKey: false });

// Hooks
ProjectSchema.post<Project & mongoose.Document>("save", async function (doc: Project, next: HookNextFunction) {
    const projectCompanyMatches = await ProjectContributorCompanyMatchModel.find({
        project: mongoose.Types.ObjectId(doc._id),
    });
    // Project company match does not exist in match table. Add the companyId with this projectId to that table
    if (
        !_.some(
            projectCompanyMatches,
            (projectCompanyMatch: ProjectContributorCompanyMatch) =>
                projectCompanyMatch.contributorCompany !== doc.company
        )
    ) {
        const model = new ProjectContributorCompanyMatchModel({
            contributorCompany: doc.company,
            project: doc._id,
        });
        await model.save().catch(() => new ExpectationFailed(ERROR_PROJECT_MATCH_NOT_CREATED));
    }
    next();
});

export const ProjectModel = mongoose.model(ProjectUtils.MODEL_NAME, ProjectSchema);
