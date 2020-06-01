import { Seed, SeedState } from "../seed";
import { TaskStatus, TaskStatusModel } from "../../../src/models/taskStatuses/TaskStatus";
import { TaskStatusUtils } from "../../../src/models/taskStatuses/TaskStatus.utils";

const taskStatusKeys = Object.keys(TaskStatusUtils.STATUS);
const taskStatusCount = taskStatusKeys.length;

module.exports = {
    seed: new Seed<TaskStatus>(TaskStatusModel, TaskStatusUtils.COLLECTION_NAME, {
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
