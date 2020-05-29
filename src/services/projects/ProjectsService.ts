import { Service, Inject } from "@tsed/common";
import { Project, ProjectModel } from "../../models/projects/Project";
import { getFieldNameFromClassName } from "../../../utils/populateByName";
import { ProjectTypeUtils } from "../../models/projectTypes/ProjectType.utils";
import * as _ from "lodash";
import { BadRequest, NotFound } from "ts-httpexceptions";
import { ERROR_NO_COMPANY_ID, ERROR_NO_PROJECT, ERROR_NO_PROJECT_ID } from "../../errors/ProjectsError";
import { MongooseModel } from "../../types/MongooseModel";

@Service()
export class ProjectsService {
    private Project: MongooseModel<Project>;

    constructor() {
        this.Project = ProjectModel as MongooseModel<Project>;
    }

    async findByCompanyId(companyId: string, activeStatus = 1): Promise<Project[]> {
        return await this.Project.find({ company: companyId, active: activeStatus })
            .populate(getFieldNameFromClassName(ProjectTypeUtils.MODEL_NAME))
            .exec();
    }

    async findProjectById(projectId: string): Promise<Project> {
        const project = await this.Project.findById(projectId).exec();
        if (!project) {
            throw new NotFound(ERROR_NO_PROJECT);
        }
        return project;
    }

    async addProject(project: Project): Promise<Project> {
        if (!_.get(project, "company")) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const model = new this.Project(project);
        return await this.Project.create(model);
    }

    async updateProject(projectId: string, projectPartial: Partial<Project>): Promise<Project> {
        if (_.isEmpty(projectId)) {
            throw new BadRequest(ERROR_NO_PROJECT_ID);
        }
        const projectResponse = await this.Project.findByIdAndUpdate(projectId, projectPartial, {
            omitUndefined: true,
        }).exec();
        return Promise.resolve({ ...projectResponse, ...projectPartial });
    }
}
