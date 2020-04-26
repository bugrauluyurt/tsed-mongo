import { Controller, Get, UseAuth, Status, QueryParams } from "@tsed/common";
import { ProjectsService } from "../../services/projects/ProjectsService";
import { Summary } from "@tsed/swagger";
import { UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { Project } from "../../models/projects/Project";
import { UseRequiredParams } from "../../decorators";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller("/projects")
export class CalendarsCtrl {
    constructor(private projectsService: ProjectsService) {}

    @Get("/")
    @Summary("Return projects by companyId, additional filtering by query params is enabled")
    @Status(200, {
        description: "Success",
        type: Project,
        collectionType: Array,
    })
    @UseRequiredParams({ type: "query", requiredParams: ["companyId"] })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getAllProjects(@QueryParams("companyId") companyId: string): Promise<Project[]> {
        return this.projectsService.findByCompanyId(companyId);
    }
}
