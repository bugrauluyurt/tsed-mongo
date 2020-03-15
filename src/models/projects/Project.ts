import { Indexed, Model, ObjectID, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { ProjectType } from "../projectTypes/projectType";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSections";

@Model()
export class Project {
    @ObjectID("id")
    _id: string;

    @Indexed()
    companyId: string;

    @Property()
    @Required()
    projectName: string;

    @Ref(ProjectSection)
    @Description("List of project sections. ProjectSection model")
    projectSections: Ref<ProjectSection>[] = [];

    @Ref(ProjectType)
    @Description("Project's type")
    projectType: Ref<ProjectType>;

    @Property()
    @Description("ObjectID of teams which are associated with this project")
    teams: string[];

    @Property()
    @Description("Active status indicator")
    active: boolean = true;

}

// [SEED] Schema Definition
export const ProjectSchemaDefinition = {};
