import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { Property, Required, MinLength, MaxLength } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSections";
import { TeamUtils } from "../teams/Team.utils";
import * as mongoose from "mongoose";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectSectionsUtils } from "../projectSections/ProjectSections.utils";
import { ERROR_PROJECT_SECTION_MISSING } from "src/errors/ProejctSectionsError";
import * as _ from "lodash";
import {
    ERROR_TASK_NAME_MIN_LENGTH,
    ERROR_TASK_NAME_MISSING,
    ERROR_TASK_NAME_MAX_LENGTH,
    ERROR_DATE_ORDER,
} from "../../errors/TasksError";
import { TaskUtils } from "./Task.utils";
import { TaskStatus } from "../taskStatuses/TaskStatus";

@MongooseSchema()
export class Task {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    @Ref(ProjectSection)
    @Indexed()
    @Description("Reference to projectSection where this task belongs to")
    projectSection: Ref<ProjectSection>;

    @Required()
    @MinLength(TaskUtils.TASK_NAME_MIN_LENGTH)
    @MaxLength(TaskUtils.TASK_NAME_MAX_LENGTH)
    @Description("Name of the task")
    taskName: string;

    @Description("Start date of the task")
    startDate: Date;

    @Description("End date of the task")
    endDate: Date;

    @Ref(TaskStatus)
    @Description("Status of the task")
    status: Ref<TaskStatus>;
}

// Schema Definition
export const TaskSchemaDefinition = {
    projectSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ProjectSectionsUtils.MODEL_NAME,
        validate: getForeignKeyValidator.call(this, ProjectSectionsUtils.MODEL_NAME, ERROR_PROJECT_SECTION_MISSING),
        required: [true, ERROR_PROJECT_SECTION_MISSING],
    },
    taskName: {
        type: String,
        required: [true, ERROR_TASK_NAME_MISSING],
        minLength: [TaskUtils.TASK_NAME_MIN_LENGTH, ERROR_TASK_NAME_MIN_LENGTH],
        maxLength: [TaskUtils.TASK_NAME_MAX_LENGTH, ERROR_TASK_NAME_MAX_LENGTH],
    },
    startDate: {
        type: Date,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        required: function () {
            return !_.isEmpty(this.endDate);
        },
        validate: {
            validator: function (startDate: Date): boolean {
                if (!this.endDate) return false;
                return this.endDate > startDate;
            },
            message: ERROR_DATE_ORDER,
        },
    },
    endDate: {
        type: Date,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        required: function () {
            return !_.isEmpty(this.startDate);
        },
        validate: {
            validator: function (endDate: Date): boolean {
                if (!this.startDate) return false;
                return endDate > this.startDate;
            },
            message: ERROR_DATE_ORDER,
        },
    },
};

export const TaskSchema = new mongoose.Schema(TaskSchemaDefinition);
export const TaskModel = mongoose.model<Task & mongoose.Document>(TeamUtils.MODEL_NAME, TaskSchema);
