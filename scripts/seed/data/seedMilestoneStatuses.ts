import { Seed, SeedState } from "../seed";
import { MilestoneStatusUtils } from "../../../src/models/milestoneStatuses/MilestoneStatus.utils";
import { MilestoneStatus, MilestoneStatusModel } from "../../../src/models/milestoneStatuses/MilestoneStatus";

const milestoneStatusKeys = Object.keys(MilestoneStatusUtils.STATUS);
const milestoneStatusCount = milestoneStatusKeys.length;

module.exports = {
    seed: new Seed<MilestoneStatus>(MilestoneStatusModel, MilestoneStatusUtils.COLLECTION_NAME, {
        documentCount: milestoneStatusCount,
    }).insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const taskStatusEnumKey = milestoneStatusKeys[index];
        return {
            name: MilestoneStatusUtils.STATUS[taskStatusEnumKey],
        } as MilestoneStatus;
    }),
};
