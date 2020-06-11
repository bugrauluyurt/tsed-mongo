import {
    BodyParams,
    Controller,
    Get,
    Patch,
    PathParams,
    Post,
    QueryParams,
    Req,
    Required,
    Status,
    UseAuth,
} from "@tsed/common";
import { ProjectSectionsService } from "../../services/projectSections/ProjectSectionsService";
import { Summary } from "@tsed/swagger";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { UserRole, UserRolesAll } from "../../models/users/UserRole";
import { ProjectSection } from "../../models/projectSections/ProjectSection";

@Controller("/projectssection")
export class ProjectSectionsCtrl {
    constructor(private projectSectionsService: ProjectSectionsService) {}

    @Get("/")
    @Summary("Return projectSections of a project")
    @Status(200, {
        description: "Success",
        type: ProjectSection,
        collectionType: Array,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getProjectSections(
        @QueryParams("projectId") @Required() projectId: string,
        @QueryParams() queryParams: any
    ): Promise<ProjectSection[]> {
        return this.projectSectionsService.findProjectSectionsByProjectId(projectId, queryParams);
    }

    @Get("/:projectSectionId")
    @Summary("Return an existing projectSection by its projectSectionId")
    @Status(200, {
        description: "Success",
        type: ProjectSection,
        collectionType: ProjectSection,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getProjectSection(
        @PathParams("projectSectionId") @Required() projectSectionId: string
    ): Promise<ProjectSection> {
        return this.projectSectionsService.findProjectSectionById(projectSectionId);
    }

    @Post("/add")
    @Summary("Adds a projectSection")
    @Status(200, {
        description: "Success",
        type: ProjectSection,
        collectionType: ProjectSection,
    })
    @UseAuth(AuthMiddleware, {
        roles: [UserRole.ADMIN, UserRole.SERVER, UserRole.PROJECT_ADMIN, UserRole.PROJECT_MANAGER],
    })
    async addProjectSection(req: Req): Promise<ProjectSection> {
        return this.projectSectionsService.addProjectSection(req.body as ProjectSection);
    }

    @Patch("/::projectSectionId/update")
    @Summary("Update a projectSection")
    @Status(200, {
        description: "Success",
        type: ProjectSection,
        collectionType: ProjectSection,
    })
    @UseAuth(AuthMiddleware, {
        roles: [UserRole.ADMIN, UserRole.SERVER, UserRole.PROJECT_ADMIN, UserRole.PROJECT_MANAGER],
    })
    async updateProjectSection(
        @BodyParams() payload: Partial<ProjectSection>,
        @PathParams("projectSectionId") projectSectionId: string
    ): Promise<ProjectSection> {
        return this.projectSectionsService.updateProjectSection(projectSectionId, payload as Partial<ProjectSection>);
    }
}
