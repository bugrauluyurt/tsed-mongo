import { ObjectID, Model } from "@tsed/mongoose";
import { Enum } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectTypeUtils } from "./ProjectType.utils";

@Model()
export class ProjectType {
    @ObjectID("id")
    _id: string;

    @Enum(ProjectTypeUtils.TYPE)
    @Description("Type of the project, one of management | sales")
    name: ProjectTypeUtils.TYPE;
}

// [SEED] Schema Definition
export const ProjectTypesSchemaDefinition = {
    name: String,
};
