import { Controller, Get, UseAuth, Status, QueryParams, Post, BodyParams } from "@tsed/common";
import { ProjectsService } from "../../services/projects/ProjectsService";
import { Summary } from "@tsed/swagger";
import { UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { Project } from "../../models/projects/Project";
import { UseRequiredParams } from "../../decorators";

@Controller("/projects")
export class ProjectsCtrl {
    constructor(private projectsService: ProjectsService) {}

    @Get("/")
    @Summary("Return active projects by companyId, additional filtering by query params is enabled")
    @Status(200, {
        description: "Success",
        type: Project,
        collectionType: Array,
    })
    @UseRequiredParams({ type: "query", requiredParams: ["companyId"] })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getAllProjects(
        @QueryParams("companyId") companyId: string,
        @QueryParams("active") activeStatus = 1
    ): Promise<Project[]> {
        return this.projectsService.findByCompanyId(companyId, activeStatus);
    }

    // @Post("/add")
    // @Summary("Adds a project")
    // @Status(200, {
    //     description: "Success",
    //     type: Project,
    //     collectionType: Project,
    // })
    // @UseRequiredParams({ type: "query", requiredParams: ["companyId"] })
    // @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    // async addProject(@BodyParams({ required: true, useValidation: true }) project: Project): any {
    //     //return this.projectsService.findByCompanyId(companyId, activeStatus);
    // }
}
