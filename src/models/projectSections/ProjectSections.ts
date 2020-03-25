import { Indexed, Model, ObjectID, PreHook, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { preSaveActiveStatus } from "../../../utils/preSaveActiveStatus";
import { Project } from "../projects/Project";
import { Schema } from "mongoose";
import { ProjectUtils } from "../projects/Project.utils";

@Model()
export class ProjectSection {
    @ObjectID("id")
    _id: string;

    @Indexed()
    @Required()
    @Description("Project parent of this section")
    projectId: string;

    @Property()
    @Required()
    @Description("Project section's name. Required to create a section")
    projectSectionName: string;

    @Property()
    @Description("Active status indicator")
    active: boolean;

    @PreHook("save")
    static preSave(projectSection: ProjectSection, next) {
        preSaveActiveStatus(projectSection);
        next();
    }
}

// [SEED] Schema Definition
export const ProjectSectionSchemaDefinition = {
    projectId: { type: Schema.Types.ObjectId, index: true },
    projectSectionName: String,
    active: Boolean,
};
