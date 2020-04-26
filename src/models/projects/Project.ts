import { Indexed, Model, ObjectID, PreHook, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { ProjectType } from "../projectTypes/projectType";
import { Description } from "@tsed/swagger";
import { Company } from "../companies/Company";
import { Team } from "../teams/Team";
import * as _ from "lodash";
import { Schema } from "mongoose";
import { CompanyUtils } from "../companies/Company.utils";
import { TeamUtils } from "../teams/Team.utils";
import { preSaveActiveStatus } from "../../../utils/preSaveActiveStatus";
import { ProjectTypeUtils } from "../projectTypes/ProjectType.utils";
import { ProjectSection } from "../projectSections/ProjectSections";
import { ProjectSectionsUtils } from "../projectSections/ProjectSections.utils";

@Model()
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
    active = true;

    @PreHook("save")
    static preSave(project: Project, next): void {
        if (_.isEmpty(project.projectSections)) {
            project.projectSections = [];
        }
        if (_.isEmpty(project.teams)) {
            project.teams = [];
        }
        preSaveActiveStatus(project);
        next();
    }
}

// [SEED] Schema Definition
export const ProjectSchemaDefinition = {
    company: { type: Schema.Types.ObjectId, ref: CompanyUtils.MODEL_NAME, index: true },
    projectName: String,
    projectSections: [{ type: Schema.Types.ObjectId, ref: ProjectSectionsUtils.MODEL_NAME }],
    projectType: { type: Schema.Types.ObjectId, ref: ProjectTypeUtils.MODEL_NAME },
    teams: [{ type: Schema.Types.ObjectId, ref: TeamUtils.MODEL_NAME }],
    active: Boolean,
};
