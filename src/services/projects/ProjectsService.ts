import { Service, Inject } from "@tsed/common";
import { Project } from "../../models/projects/Project";
import { MongooseModel } from "@tsed/mongoose";
import { getFieldNameFromClassName } from "../../../utils/populateByName";
import { ProjectTypeUtils } from "../../models/projectTypes/ProjectType.utils";
import { Company } from "../../models/companies/Company";
import * as _ from "lodash";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_COMPANY_MISSING, ERROR_NO_COMPANY_ID } from "../../errors/ProjectsError";

@Service()
export class ProjectsService {
    @Inject(Project)
    private Project: MongooseModel<Project>;
    @Inject(Company)
    private Company: MongooseModel<Company>;

    async findByCompanyId(companyId: string, activeStatus = 1): Promise<Project[]> {
        return await this.Project.find({ company: companyId, active: activeStatus })
            .populate(getFieldNameFromClassName(ProjectTypeUtils.MODEL_NAME))
            .exec();
    }

    async getProjectById(projectId: string): Promise<Project> {
        return await this.Project.findById(projectId).exec();
    }

    async addProject(project: Project): Promise<Project> {
        if (!_.get(project, "company")) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const model = new this.Project(project);
        return await this.Project.create(model);
    }

    async updateProject(projectId: string, project: Omit<Project, "companyId" | "_id">): Promise<Project> {
        // @TODO: Validate project partial. Ref Id existence if automatically validated by idValidator plugin on the model itself.
        return await this.Project.findByIdAndUpdate(projectId, project, { omitUndefined: true }).exec();
    }
}
