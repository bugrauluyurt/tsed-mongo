import { Model, ObjectID, PreHook } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { preSaveActiveStatus } from "../../../utils/preSaveActiveStatus";

@Model()
export class ProjectSection {
    @ObjectID("id")
    _id: string;

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
