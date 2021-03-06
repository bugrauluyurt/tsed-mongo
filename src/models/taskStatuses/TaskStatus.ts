import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Enum, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { TaskStatusUtils } from "./TaskStatus.utils";
import * as mongoose from "mongoose";
import { ERROR_TASK_STATUS_NAME_MISSING } from "../../errors/TaskStatusError";

@MongooseSchema()
export class TaskStatus {
    @ObjectID("id")
    _id: string;

    @Required()
    @Enum(TaskStatusUtils.STATUS)
    @Description("Status of the task, one of ready | working | stuck | done | introCall | negotiation")
    name: TaskStatusUtils.STATUS;
}

// Schema Definition
export const TaskStatusSchemaDefinition = {
    name: {
        type: String,
        required: [true, ERROR_TASK_STATUS_NAME_MISSING],
        enum: [
            TaskStatusUtils.STATUS.READY,
            TaskStatusUtils.STATUS.DONE,
            TaskStatusUtils.STATUS.INTRO_CALL,
            TaskStatusUtils.STATUS.NEGOTIATION,
            TaskStatusUtils.STATUS.STUCK,
            TaskStatusUtils.STATUS.WORKING,
        ],
    },
};

export const TaskStatusSchema = new mongoose.Schema(TaskStatusSchemaDefinition, {
    versionKey: false,
});
export const TaskStatusModel = mongoose.model<TaskStatus & mongoose.Document>(
    TaskStatusUtils.MODEL_NAME,
    TaskStatusSchema
);
