import { MongooseModel } from "../../types/MongooseModel";
import { Service } from "@tsed/di";
import { ProjectSection, ProjectSectionModel } from "../../models/projectSections/ProjectSection";
import { NotFound } from "ts-httpexceptions";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import { getSanitizedPaginationParams } from "../../../utils/paginationHelper";
import { IProjectSectionQueryParams } from "../../interfaces/ProjectSection/ProjectSectionQueryParams.interface";
import * as _ from "lodash";

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
}
