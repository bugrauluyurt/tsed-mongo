import * as faker from "faker";
import { Seed, SeedState } from "../seed";
import { Team, TeamModel } from "../../../src/models/teams/Team";
import { TeamUtils } from "../../../src/models/teams/Team.utils";

module.exports = {
    seed: new Seed<Team>(TeamModel, TeamUtils.COLLECTION_NAME, { documentCount: 5 }).insertMany(
        (beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
            // INFO
            // Previous seeded collections can be reached at each document level by using seedState instance.
            // seedState.getState() OR seedState.getCollection(collectionName)
            return {
                teamName: `${TeamUtils.MODEL_NAME}_${faker.fake("{{name.jobArea}}")}`,
            } as Team;
        }
    ),
};
