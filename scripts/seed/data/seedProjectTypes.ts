import { Seed, SeedState } from "../seed";
import * as mongoose from "mongoose";
import { ProjectType, ProjectTypesSchemaDefinition } from "../../../src/models/projectTypes/ProjectType";
import { ProjectTypeUtils } from "../../../src/models/projectTypes/ProjectType.utils";

const projectTypeSchema = new mongoose.Schema(ProjectTypesSchemaDefinition);
const projectTypeModel = mongoose.model<ProjectType & mongoose.Document>(
    ProjectTypeUtils.COLLECTION_NAME,
    projectTypeSchema
);
const projectTypeKeys = Object.keys(ProjectTypeUtils.TYPE);
const projectTypeCount = projectTypeKeys.length;

module.exports = {
    schema: projectTypeSchema,
    model: projectTypeModel,
    seed: new Seed<ProjectType>(projectTypeModel, ProjectTypeUtils.COLLECTION_NAME, {
        documentCount: projectTypeCount,
    }).insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const projectTypeEnumKey = projectTypeKeys[index];
        return {
            name: ProjectTypeUtils.TYPE[projectTypeEnumKey],
        } as ProjectType;
    }),
};
