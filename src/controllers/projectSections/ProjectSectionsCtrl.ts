import { Controller, Get, PathParams, QueryParams, Required, Status, UseAuth } from "@tsed/common";
import { ProjectSectionsService } from "src/services/projectSections/ProjectSectionsService";
import { Summary } from "@tsed/swagger";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { UserRolesAll } from "../../models/users/UserRole";
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
        @QueryParams("page") page: number,
        @QueryParams("pageSize") pageSize: number,
        // @TODO Write query params type here.
        @QueryParams() queryParams: any
    ): Promise<ProjectSection[]> {
        return this.projectSectionsService.findProjectSectionsByProjectId(projectId, page, pageSize);
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
}
