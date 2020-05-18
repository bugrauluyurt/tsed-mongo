import * as mongoose from "mongoose";
import * as faker from "faker";
import { Project, ProjectSchemaDefinition } from "../../../src/models/projects/Project";
import { ProjectUtils } from "../../../src/models/projects/Project.utils";
import { Company } from "../../../src/models/companies/Company";
import { SeedState } from "../seed";
import { ProjectType } from "../../../src/models/projectTypes/ProjectType";
import { getRandomUniqueSeedItems } from "../seedUtils";
import { ProjectTypeUtils } from "../../../src/models/projectTypes/ProjectType.utils";
import * as _ from "lodash";
import { ActiveStatus } from "../../../src/enums/activeStatus";

const projectSchema = new mongoose.Schema(ProjectSchemaDefinition);
const projectModel = mongoose.model<Project & mongoose.Document>(ProjectUtils.MODEL_NAME, projectSchema);

const createProjects = (
    company: Company,
    seedState: SeedState,
    projectTypes: ProjectType[],
    requiredProjectCount = 5
): Promise<Project[]> => {
    const projectsPromiseBatch = [];
    let count = requiredProjectCount;
    const createRandomProject = () => {
        const randomProjectType = getRandomUniqueSeedItems(projectTypes, 1, false, ProjectTypeUtils.COLLECTION_NAME);
        const fakeProjectName = faker.fake("{{random.word}}");
        const projectTemplate = {
            company: company._id,
            projectName: `Project_${fakeProjectName.replace(/ /g, "_")}`,
            projectType: _.get(randomProjectType, "0._id"),
            active: ActiveStatus.ACTIVE,
        };
        return projectModel.create(projectTemplate);
    };
    while (count) {
        projectsPromiseBatch.push(createRandomProject());
        count--;
    }
    return Promise.all(projectsPromiseBatch);
};

module.exports = {
    schema: projectSchema,
    model: projectModel,
    createProjects: createProjects,
};
