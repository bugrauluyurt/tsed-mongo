import { Arg, Args, Query, Ctx, Resolver } from "type-graphql";
import { ProjectsService } from "./ProjectsService";
import { Project } from "../../models/projects/Project";
import { Service } from "@tsed/common";

@Service()
@Resolver(Project)
export class ProjectResolver {
    constructor(private projectsService: ProjectsService) {}

    @Query((returns) => Project)
    async project(@Arg("id") id: string): Promise<Project> {
        return await this.projectsService.findProjectById(id);
    }
}
