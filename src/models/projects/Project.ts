import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
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
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectUtils } from "./Project.utils";
import * as _ from "lodash";
import {
    ERROR_COMPANY_MISSING,
    ERROR_PROJECT_NAME_MAX_LENGTH,
    ERROR_PROJECT_NAME_MIN_LENGTH,
    ERROR_PROJECT_NAME_MISSING,
    ERROR_PROJECT_TYPE_MISSING,
    ERROR_NOT_VALID_PROJECT_TYPE,
    ERROR_TEAM_MISSING,
    ERROR_PROJECT_ADMIN_MISSING,
    ERROR_PROJECT_MANAGER_MISSING,
} from "../../errors/ProjectsError";
import { User } from "../users/User";
import { UserUtils } from "../users/User.utils";

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
        maxLength: [2, ERROR_PROJECT_NAME_MAX_LENGTH],
    },
    projectSections: [{ type: Schema.Types.ObjectId, ref: ProjectSectionsUtils.MODEL_NAME }],
    projectType: {
        type: Schema.Types.ObjectId,
        ref: ProjectTypeUtils.MODEL_NAME,
        required: [true, ERROR_PROJECT_TYPE_MISSING],
        validate: getForeignKeyValidator.call(this, ProjectTypeUtils.MODEL_NAME, ERROR_NOT_VALID_PROJECT_TYPE),
    },
    projectAdmins: [
        {
            type: Schema.Types.ObjectId,
            ref: UserUtils.MODEL_NAME,
            required: [true, ERROR_PROJECT_ADMIN_MISSING],
            validate: getForeignKeyValidator.call(this, UserUtils.MODEL_NAME, ERROR_PROJECT_ADMIN_MISSING),
        },
    ],
    projectManagers: [
        {
            type: Schema.Types.ObjectId,
            ref: UserUtils.MODEL_NAME,
            validate: getForeignKeyValidator.call(this, UserUtils.MODEL_NAME, ERROR_PROJECT_MANAGER_MISSING),
        },
    ],
    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: TeamUtils.MODEL_NAME,
            validate: getForeignKeyValidator.call(this, TeamUtils.MODEL_NAME, ERROR_TEAM_MISSING),
        },
    ],
    active: Number,
};

export const ProjectSchema = new Schema(ProjectSchemaDefinition);
ProjectSchema.pre("save", function <Project>(next) {
    if (_.isEmpty(this.projectSections)) {
        this.projectSections = [];
    }
    if (_.isEmpty(this.teams)) {
        this.teams = [];
    }
    if (_.isEmpty(this.projectManagers)) {
        this.projectManagers = [];
    }
    preSaveActiveStatus(this);
    next();
});

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

    @Required()
    @Ref(User)
    @Description("Project's admins who can do crud operations")
    projectAdmins: Ref<User[]>;

    @Ref(User)
    @Description(
        "Project's managers who are authorized to do team changes, change the active status of the projects and manipulate project sections"
    )
    projectManagers: Ref<User[]>;

    @Property()
    @Ref(Team)
    @Description("Teams associated with this project")
    teams: Ref<Team>[] = [];

    @Property()
    @Description("Active status indicator")
    active = 1;
}

export const ProjectModel = mongoose.model(ProjectUtils.MODEL_NAME, ProjectSchema);
