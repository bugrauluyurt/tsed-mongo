import * as faker from "faker";
import { Project, ProjectModel } from "../../../src/models/projects/Project";
import { Company } from "../../../src/models/companies/Company";
import { SeedState } from "../seed";
import { ProjectType } from "../../../src/models/projectTypes/ProjectType";
import { getRandomUniqueSeedItems } from "../seedUtils";
import { ProjectTypeUtils } from "../../../src/models/projectTypes/ProjectType.utils";
import * as _ from "lodash";
import { ActiveStatus } from "../../../src/enums/ActiveStatus";
import { User } from "../../../src/models/users/User";
import { Promise } from "mongoose";

const createProjects = (
    projectAdmin: User,
    company: Company,
    seedState: SeedState,
    projectTypes: ProjectType[],
    requiredProjectCount = 5
): Promise<Project[]> => {
    const projectsPromiseBatch = [];
    let count = requiredProjectCount;
    const createRandomProject = (): Promise<object> => {
        const randomProjectType = getRandomUniqueSeedItems(projectTypes, 1, false, ProjectTypeUtils.COLLECTION_NAME);
        const fakeProjectName = faker.fake("{{random.word}}");
        const projectTemplate = {
            company: company._id,
            projectName: `Project_${fakeProjectName.replace(/ /g, "_")}`,
            projectType: _.get(randomProjectType, "0._id"),
            active: ActiveStatus.ACTIVE,
        };
        return new ProjectModel(projectTemplate).save({ validateBeforeSave: false });
    };
    while (count) {
        projectsPromiseBatch.push(createRandomProject());
        count--;
    }
    return Promise.all(projectsPromiseBatch);
};

module.exports = {
    createProjects: createProjects,
};
