import { MongooseModel } from "../../types/MongooseModel";
import { Service } from "@tsed/di";
import { ProjectSection, ProjectSectionModel } from "../../models/projectSections/ProjectSection";
import { NotFound } from "ts-httpexceptions";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import { PageSizes } from "../../enums/pageSizes";

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
        page = 0,
        pageSize = PageSizes.TWENTY
    ): Promise<ProjectSection[]> {
        // @TODO Filtering and sorting of projectSections should be done here.
        return Promise.resolve([]);
    }
}
