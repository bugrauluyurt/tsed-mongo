import { Indexed, Model, MongoosePlugin, MongooseSchema, ObjectID, PreHook, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Company } from "../companies/Company";
import { Team } from "../teams/Team";
import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { CompanyUtils } from "../companies/Company.utils";
import { TeamUtils } from "../teams/Team.utils";
import { preSaveActiveStatus } from "../../../utils/preSaveActiveStatus";
import { ProjectTypeUtils } from "../projectTypes/ProjectType.utils";
import { ProjectSection } from "../projectSections/ProjectSections";
import { ProjectSectionsUtils } from "../projectSections/ProjectSections.utils";
import { ProjectType } from "../projectTypes/ProjectType";
import * as IdValidator from "mongoose-id-validator";
import { foreignKeyHelper } from "../../../utils/foreignKeyHelper";
import { ProjectUtils } from "./Project.utils";
import * as _ from "lodash";
import { ERROR_COMPANY_MISSING } from "../../errors/ProjectsError";

// [SEED] Schema Definition
export const ProjectSchemaDefinition = {
    company: {
        type: Schema.Types.ObjectId,
        ref: CompanyUtils.MODEL_NAME,
        validate: {
            validator: (v): Promise<boolean> => {
                return foreignKeyHelper(mongoose.model(CompanyUtils.MODEL_NAME), v);
            },
            message: ERROR_COMPANY_MISSING,
        },
        index: true,
    },
    projectName: String,
    projectSections: [{ type: Schema.Types.ObjectId, ref: ProjectSectionsUtils.MODEL_NAME }],
    projectType: { type: Schema.Types.ObjectId, ref: ProjectTypeUtils.MODEL_NAME },
    teams: [{ type: Schema.Types.ObjectId, ref: TeamUtils.MODEL_NAME }],
    active: Number,
};

@MongooseSchema()
@MongoosePlugin(IdValidator)
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
    @Ref(Team)
    @Description("Teams associated with this project")
    teams: Ref<Team>[] = [];

    @Property()
    @Description("Active status indicator")
    active = 1;

    @PreHook("save")
    static preSave(project: Project, next): any {
        if (_.isEmpty(project.projectSections)) {
            project.projectSections = [];
        }
        if (_.isEmpty(project.teams)) {
            project.teams = [];
        }
        preSaveActiveStatus(project);
        return Promise.all([foreignKeyHelper(Company, _.get(project, "company"))]);
    }
}

export const ProjectModel = mongoose.model(ProjectUtils.MODEL_NAME, new Schema(ProjectSchemaDefinition));
