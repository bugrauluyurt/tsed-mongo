import { Service } from "@tsed/common";
import { Project, ProjectModel } from "../../models/projects/Project";
import { getFieldNameFromClassName } from "../../utils/populateByName";
import { ProjectTypeUtils } from "../../models/projectTypes/ProjectType.utils";
import * as _ from "lodash";
import { BadRequest, NotFound } from "ts-httpexceptions";
import {
    ERROR_NO_COMPANY_ID,
    ERROR_NO_PROJECT,
    ERROR_NO_PROJECT_ID,
    ERROR_NO_TEAM_ID,
} from "../../errors/ProjectsError";
import { MongooseModel } from "../../types/MongooseModel";
import { ProjectSection, ProjectSectionModel } from "../../models/projectSections/ProjectSection";
import * as mongoose from "mongoose";
import { isValidMongoId } from "../../utils/isValidMongoId";
import { ERROR_NOT_VALID_PROJECT_ID } from "../../errors/ProjectsError";

@Service()
export class ProjectsService {
    private Project: MongooseModel<Project>;
    private ProjectSection: MongooseModel<ProjectSection>;

    constructor() {
        this.Project = ProjectModel as MongooseModel<Project>;
        this.ProjectSection = ProjectSectionModel as MongooseModel<ProjectSection>;
    }

    async findByCompanyId(companyId: string, activeStatus = 1): Promise<Project[]> {
        return await this.Project.find({ company: companyId, active: activeStatus })
            .populate(getFieldNameFromClassName(ProjectTypeUtils.MODEL_NAME))
            .exec();
    }

    async findProjectById(projectId: string): Promise<Project> {
        if (!isValidMongoId(projectId)) {
            throw new BadRequest(ERROR_NOT_VALID_PROJECT_ID);
        }
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
        return await model.save();
    }

    async updateProject(projectId: string, projectPartial: Partial<Project>): Promise<Project> {
        if (_.isEmpty(projectId)) {
            throw new BadRequest(ERROR_NO_PROJECT_ID);
        }
        return await this.Project.findByIdAndUpdate(
            projectId,
            _.omit(projectPartial, ["company", "projectAdmins", "projectManagers"]),
            {
                omitUndefined: true,
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    async removeProject(projectId: string): Promise<Project> {
        if (_.isEmpty(projectId)) {
            throw new BadRequest(ERROR_NO_PROJECT_ID);
        }
        const project = await this.Project.findById(projectId);
        if (!project) {
            throw new BadRequest(ERROR_NO_PROJECT);
        }
        return await Promise.all([
            this.ProjectSection.deleteMany({ projectId }).exec().catch() as Promise<any>,
            this.Project.findByIdAndDelete(projectId).exec(),
        ]).then((response) => _.last(response));
    }

    async updateTeams(projectId: string, teamIds: string[]): Promise<Project> {
        if (_.isEmpty(teamIds)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Project.findOneAndUpdate(
            { _id: projectId },
            { teams: teamIds },
            {
                omitUndefined: true,
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    async updateProjectSections(projectId: string, projectSectionIds: string[] = []): Promise<Project> {
        const { projectSections = [] } = await this.Project.findById(projectId).exec();
        const deletedProjectSectionIds = _.difference(projectSections, projectSectionIds) as string[];

        const projectSectionModelBatch: Promise<any> = this.ProjectSection.deleteMany({
            _id: {
                $in: _.reduce(
                    deletedProjectSectionIds,
                    (acc, projectSectionId) => acc.concat([mongoose.Types.ObjectId(projectSectionId)]),
                    []
                ),
            },
        }).exec();
        return await Promise.all([
            projectSectionModelBatch,
            this.Project.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(projectId) },
                { projectSections: projectSectionIds },
                {
                    omitUndefined: true,
                    new: true,
                    runValidators: true,
                }
            ).exec(),
        ]).then((response) => _.last(response));
    }
}
