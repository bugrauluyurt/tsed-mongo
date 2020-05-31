import {
    Controller,
    Get,
    UseAuth,
    Status,
    QueryParams,
    Post,
    Req,
    PathParams,
    Required,
    Patch,
    BodyParams,
    Delete,
} from "@tsed/common";
import { ProjectsService } from "../../services/projects/ProjectsService";
import { Summary } from "@tsed/swagger";
import { UserRole, UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { Project } from "../../models/projects/Project";
import { UseRequiredParams } from "../../decorators";
import * as _ from "lodash";

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

    @Get("/:projectId")
    @Summary("Return an existing project by its projecId")
    @Status(200, {
        description: "Success",
        type: Project,
        collectionType: Project,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getProject(@PathParams("projectId") @Required() projectId: string): Promise<Project> {
        return this.projectsService.findProjectById(projectId);
    }

    @Post("/add")
    @Summary("Adds a project")
    @Status(200, {
        description: "Success",
        type: Project,
        collectionType: Project,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.PROJECT_ADMIN] })
    async addProject(req: Req): Promise<Project> {
        return this.projectsService.addProject(req.body as Project);
    }

    @Patch("/:projectId/update")
    @Summary("Update a project")
    @Status(200, {
        description: "Success",
        type: Project,
        collectionType: Project,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.PROJECT_ADMIN] })
    async updateProject(
        @BodyParams() payload: Partial<Project>,
        @PathParams("projectId") projectId: string
    ): Promise<Project> {
        return this.projectsService.updateProject(projectId, payload as Partial<Project>);
    }

    @Delete("/:projectId/remove")
    @Summary("Update a project")
    @Status(200, {
        description: "Success",
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.PROJECT_ADMIN] })
    async removeProject(@PathParams("projectId") projectId: string): Promise<Project> {
        return this.projectsService.removeProject(projectId);
    }
}
