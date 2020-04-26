import { Seed, SeedState } from "../seed";
import * as mongoose from "mongoose";
import { TaskStatus, TaskStatusSchemaDefinition } from "../../../src/models/taskStatuses/TaskStatus";
import { TaskStatusUtils } from "../../../src/models/taskStatuses/TaskStatus.utils";

const taskStatusSchema = new mongoose.Schema(TaskStatusSchemaDefinition);
const taskStatusModel = mongoose.model<TaskStatus & mongoose.Document>(
    TaskStatusUtils.COLLECTION_NAME,
    taskStatusSchema
);
const taskStatusKeys = Object.keys(TaskStatusUtils.STATUS);
const taskStatusCount = taskStatusKeys.length;

module.exports = {
    schema: taskStatusSchema,
    model: taskStatusModel,
    seed: new Seed<TaskStatus>(taskStatusModel, TaskStatusUtils.COLLECTION_NAME, {
        documentCount: taskStatusCount,
    }).insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const taskStatusEnumKey = taskStatusKeys[index];
        return {
            name: TaskStatusUtils.STATUS[taskStatusEnumKey],
        } as TaskStatus;
    }),
};
