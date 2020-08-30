import { MongooseModel } from "../../types/MongooseModel";
import { Service } from "@tsed/di";
import { ProjectSection, ProjectSectionModel } from "../../models/projectSections/ProjectSection";
import { BadRequest, NotFound } from "ts-httpexceptions";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import { getSanitizedPaginationParams } from "../../utils/paginationHelper";
import { IProjectSectionQueryParams } from "../../interfaces/ProjectSection/ProjectSectionQueryParams.interface";
import * as _ from "lodash";
import {
    ERROR_NO_PROJECT_ID,
    ERROR_NO_PROJECT_SECTION_ID,
    ERROR_NOT_VALID_PROJECT_SECTION,
} from "../../errors/ProjectsError";
import { isValidMongoId } from "../../utils/isValidMongoId";

@Service()
export class ProjectSectionsService {
    private ProjectSection: MongooseModel<ProjectSection>;

    constructor() {
        this.ProjectSection = ProjectSectionModel as MongooseModel<ProjectSection>;
    }

    async findProjectSectionById(projectSectionId: string): Promise<ProjectSection> {
        const projectSection = await this.ProjectSection.findById(projectSectionId).exec();
        if (!projectSection) {
            throw new NotFound(ERROR_PROJECT_SECTION_MISSING);
        }
        return projectSection;
    }

    async findProjectSectionsByProjectId(
        projectId: string,
        queryParams: IProjectSectionQueryParams
    ): Promise<ProjectSection[]> {
        const { page, pageSize } = getSanitizedPaginationParams(queryParams);
        const conditions = { projectId } as Partial<IProjectSectionQueryParams>;
        const active = _.get(queryParams, "active");
        if (!_.isUndefined(active)) {
            conditions.active = active;
        }
        return await this.ProjectSection.find(conditions)
            .sort({ projectSectionName: 1 })
            .skip(page * pageSize)
            .limit(pageSize)
            .exec();
    }

    async addProjectSection(projectSection: ProjectSection): Promise<ProjectSection> {
        if (!_.get(projectSection, "projectId")) {
            throw new BadRequest(ERROR_NO_PROJECT_ID);
        }
        const model = new this.ProjectSection(projectSection);
        return await model.save();
    }

    async updateProjectSection(
        projectSectionId: string,
        projectSectionPartial: Partial<ProjectSection>
    ): Promise<ProjectSection> {
        if (_.isEmpty(projectSectionId)) {
            throw new BadRequest(ERROR_NO_PROJECT_SECTION_ID);
        }
        return await this.ProjectSection.findByIdAndUpdate(
            projectSectionId,
            _.omit(projectSectionPartial, "projectId"),
            {
                omitUndefined: true,
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    async removeProjectSection(projectSectionId: string): Promise<boolean> {
        if (_.isEmpty(projectSectionId)) {
            throw new BadRequest(ERROR_NO_PROJECT_SECTION_ID);
        }
        if (!isValidMongoId(projectSectionId)) {
            throw new BadRequest(ERROR_NOT_VALID_PROJECT_SECTION);
        }
        return await this.ProjectSection.findByIdAndDelete(projectSectionId)
            .exec()
            .then(() => true);
    }
}
