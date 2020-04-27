import { Service, Inject } from "@tsed/common";
import { Project } from "../../models/projects/Project";
import { MongooseModel } from "@tsed/mongoose";

@Service()
export class ProjectsService {
    @Inject(Project)
    private Project: MongooseModel<Project>;
    async findByCompanyId(companyId: string, isActive = true): Promise<Project[]> {
        return await this.Project.find({ company: companyId, active: isActive });
    }
}
