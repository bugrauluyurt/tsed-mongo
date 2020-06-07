import { Indexed, MongooseSchema, ObjectID } from "@tsed/mongoose";
import { MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Schema } from "mongoose";
import { ActiveStatus } from "../../enums/activeStatus";
import { ERROR_NO_PROJECT, ERROR_NO_PROJECT_ID } from "../../errors/ProjectsError";
import * as mongoose from "mongoose";
import { ProjectSectionsUtils } from "./ProjectSection.utils";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectUtils } from "../projects/Project.utils";
import {
    ERROR_NO_PROJECT_SECTION_NAME,
    ERROR_PROJECT_SECTION_NAME_MIN_LENGTH,
    ERROR_PROJECT_SECTION_NAME_MAX_LENGTH,
} from "../../errors/ProjectSectionsError";

@MongooseSchema()
export class ProjectSection {
    @ObjectID("id")
    _id: string;

    @Indexed()
    @Required()
    @Description("Project parent of this section")
    projectId: string;

    @Property()
    @Required()
    @MinLength(ProjectSectionsUtils.MIN_PROJECT_SECTION_NAME)
    @MaxLength(ProjectSectionsUtils.MAX_PROJECT_SECTION_NAME)
    @Description("Project section's name. Required to create a section")
    projectSectionName: string;

    @Property()
    @Description("Active status indicator")
    active: number = ActiveStatus.ACTIVE;
}

// Schema Definition
export const ProjectSectionSchemaDefinition = {
    projectId: {
        type: Schema.Types.ObjectId,
        index: true,
        required: [true, ERROR_NO_PROJECT_ID],
        validate: getForeignKeyValidator.call(this, ProjectUtils.MODEL_NAME, ERROR_NO_PROJECT),
    },
    projectSectionName: {
        type: String,
        required: [true, ERROR_NO_PROJECT_SECTION_NAME],
        minLength: [ProjectSectionsUtils.MIN_PROJECT_SECTION_NAME, ERROR_PROJECT_SECTION_NAME_MIN_LENGTH],
        maxLength: [ProjectSectionsUtils.MAX_PROJECT_SECTION_NAME, ERROR_PROJECT_SECTION_NAME_MAX_LENGTH],
    },
    active: { type: Number, default: ActiveStatus.ACTIVE },
};

export const ProjectSectionSchema = new Schema(ProjectSectionSchemaDefinition);
export const ProjectSectionModel = mongoose.model<ProjectSection & mongoose.Document>(
    ProjectSectionsUtils.MODEL_NAME,
    ProjectSectionSchema
);
