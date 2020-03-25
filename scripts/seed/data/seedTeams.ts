import * as faker from "faker";
import { Seed, SeedState } from "../seed";
import * as mongoose from "mongoose";
import { Team, TeamSchemaDefinition } from "../../../src/models/teams/Team";
import { TeamUtils } from "../../../src/models/teams/Team.utils";

const userSchema = new mongoose.Schema(TeamSchemaDefinition);
const userModel = mongoose.model<Team & mongoose.Document>(TeamUtils.COLLECTION_NAME, userSchema);

module.exports = {
    schema: userSchema,
    model: userModel,
    seed: (new Seed<Team>(userModel, TeamUtils.COLLECTION_NAME, {documentCount: 5}))
        .insertMany((
            beforeEachResponse: string[],
            index: number,
            seedState: SeedState,
            preSeedResponse) => {
            // INFO
            // Previous seeded collections can be reached at each document level by using seedState instance.
            // seedState.getState() OR seedState.getCollection(collectionName)
            return {
                teamName: `${TeamUtils.MODEL_NAME}_${faker.fake("{{name.jobArea}}")}`,
            } as Team;
        })
};
