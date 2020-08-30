import { Indexed, MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Schema } from "mongoose";
import { ActiveStatus } from "../../enums/ActiveStatus";
import { ERROR_NO_PROJECT, ERROR_NO_PROJECT_ID } from "../../errors/ProjectsError";
import * as mongoose from "mongoose";
import { ProjectSectionsUtils } from "./ProjectSection.utils";
import { getForeignKeyValidator } from "../../utils/foreignKeyHelper";
import { ProjectUtils } from "../projects/Project.utils";
import {
    ERROR_NO_PROJECT_SECTION_NAME,
    ERROR_PROJECT_SECTION_NAME_MIN_LENGTH,
    ERROR_PROJECT_SECTION_NAME_MAX_LENGTH,
} from "../../errors/ProjectSectionsError";
import { ObjectType, ID, Field } from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@MongooseSchema()
@ObjectType()
export class ProjectSection {
    @ObjectID("id")
    @Field(() => ID)
    _id: string;

    @Indexed()
    @Required()
    @Description("Project parent of this section")
    @Field(() => String)
    projectId: string;

    @Property()
    @Required()
    @MinLength(ProjectSectionsUtils.MIN_PROJECT_SECTION_NAME)
    @MaxLength(ProjectSectionsUtils.MAX_PROJECT_SECTION_NAME)
    @Field(() => String)
    @Description("Project section's name. Required to create a section")
    projectSectionName: string;

    @Property()
    @Description("Active status indicator")
    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active: ActiveStatus = ActiveStatus.ACTIVE;
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

export const ProjectSectionSchema = new Schema(ProjectSectionSchemaDefinition, { versionKey: false });
export const ProjectSectionModel = mongoose.model<ProjectSection & mongoose.Document>(
    ProjectSectionsUtils.MODEL_NAME,
    ProjectSectionSchema
);
