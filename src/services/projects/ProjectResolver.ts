import { ResolverService } from "@tsed/graphql";
import { Arg, Args, Query, Ctx } from "type-graphql";
import { Project } from "../../models/projects/Project";
import { ProjectsService } from "./ProjectsService";

@ResolverService(Project)
export class ProjectResolver {
    constructor(private projectsService: ProjectsService) {}
    @Query((returns) => Project)
    async project(@Arg("id", { validate: true }) id: string): Promise<Project> {
        return await this.projectsService.findProjectById(id);
    }
}
