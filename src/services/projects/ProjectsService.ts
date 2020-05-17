import { Service, Inject } from "@tsed/common";
import { Project } from "../../models/projects/Project";
import { MongooseModel } from "@tsed/mongoose";
import { getFieldNameFromClassName } from "../../../utils/populateByName";
import { ProjectTypeUtils } from "../../models/projectTypes/ProjectType.utils";

@Service()
export class ProjectsService {
    @Inject(Project)
    private Project: MongooseModel<Project>;
    async findByCompanyId(companyId: string, activeStatus = 1): Promise<Project[]> {
        const projects = await this.Project.find({ company: companyId, active: activeStatus }).populate(
            getFieldNameFromClassName(ProjectTypeUtils.MODEL_NAME)
        );
        return projects;
    }
}
