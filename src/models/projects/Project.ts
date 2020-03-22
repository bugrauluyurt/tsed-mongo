import { Indexed, Model, ObjectID, PreHook, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { ProjectType } from "../projectTypes/projectType";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSections";
import { Company } from "../companies/Company";
import { Team } from "../teams/Team";
import * as _ from "lodash";
import { Schema } from "mongoose";
import { CompanyUtils } from "../companies/Company.utils";
import { preSaveActiveStatus } from "../../../utils/preSaveActiveStatus";
import { ProjectSectionsUtils } from "../projectSections/ProjectSections.utils";
import { ProjectTypeUtils } from "../projectTypes/ProjectType.utils";
import { TeamUtils } from "../teams/Team.utils";

@Model()
export class Project {
    @ObjectID("id")
    _id: string;

    @Indexed()
    @Ref(Company)
    @Description("Company which project belongs to")
    company: Ref<Company>;

    @Property()
    @Required()
    projectName: string;

    @Ref(ProjectSection)
    @Description("List of project sections. ProjectSection model")
    projectSections: Ref<ProjectSection>[] = []; // should be populated, not-expensive

    @Ref(ProjectType)
    @Required()
    @Description("Project's type")
    projectType: Ref<ProjectType>; // should be populated, not-expensive

    @Property()
    @Ref(Team)
    @Description("Teams associated with this project")
    teams: Ref<Team>[] = [];

    @Property()
    @Description("Active status indicator")
    active: boolean = true;

    @PreHook("save")
    static preSave(project: Project, next) {
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
