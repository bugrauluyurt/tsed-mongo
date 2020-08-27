import { ResolverService } from "@tsed/graphql";
import { Arg, Args, Query, Ctx } from "type-graphql";
import { ProjectsService } from "./ProjectsService";
import { Project } from "../../models/projects/Project";

@ResolverService(Project)
export class ProjectResolver {
    constructor(private projectsService: ProjectsService) {}
    @Query((returns) => Project)
    async project(@Arg("id") id: string): Promise<Project> {
        return await this.projectsService.findProjectById(id);
    }
}
