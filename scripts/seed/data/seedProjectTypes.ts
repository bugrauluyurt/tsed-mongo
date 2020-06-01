import { Seed, SeedState } from "../seed";
import { ProjectType, ProjectTypeModel } from "../../../src/models/projectTypes/ProjectType";
import { ProjectTypeUtils } from "../../../src/models/projectTypes/ProjectType.utils";

const projectTypeKeys = Object.keys(ProjectTypeUtils.TYPE);
const projectTypeCount = projectTypeKeys.length;

module.exports = {
    seed: new Seed<ProjectType>(ProjectTypeModel, ProjectTypeUtils.COLLECTION_NAME, {
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
