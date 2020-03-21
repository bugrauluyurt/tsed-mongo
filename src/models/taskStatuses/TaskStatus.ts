import { Model, ObjectID, } from "@tsed/mongoose";
import { Enum } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { TaskStatusUtils } from "./TaskStatus.utils";

@Model()
export class TaskStatus {
    @ObjectID("id")
    _id: string;

    @Enum(TaskStatusUtils.STATUS)
    @Description("Status of the task, one of working | stuck | done | introCall | negotiation")
    name: TaskStatusUtils.STATUS;
}

// [SEED] Schema Definition
export const TaskStatusSchemaDefinition = {
    name: String,
};
