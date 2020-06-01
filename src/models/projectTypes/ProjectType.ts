import { ObjectID, MongooseSchema } from "@tsed/mongoose";
import { Enum } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectTypeUtils } from "./ProjectType.utils";
import { ERROR_PROJECT_TYPE_NAME_MISSING } from "../../errors/ProjectTypesError";
import { Schema } from "mongoose";
import * as mongoose from "mongoose";

@MongooseSchema()
export class ProjectType {
    @ObjectID("id")
    _id: string;

    @Enum(ProjectTypeUtils.TYPE)
    @Description("Type of the project, one of management | sales")
    name: ProjectTypeUtils.TYPE;
}

// Schema Definition
export const ProjectTypesSchemaDefinition = {
    name: {
        type: String,
        required: [true, ERROR_PROJECT_TYPE_NAME_MISSING],
        enum: [ProjectTypeUtils.TYPE.MANAGEMENT, ProjectTypeUtils.TYPE.SALES],
    },
};

export const ProjectTypeSchema = new Schema(ProjectTypesSchemaDefinition);
export const ProjectTypeModel = mongoose.model<ProjectType & mongoose.Document>(
    ProjectTypeUtils.MODEL_NAME,
    ProjectTypeSchema
);
