import {
    BodyParams,
    Controller,
    Delete,
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
import { Summary } from "@tsed/swagger";
import { UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { TeamQueryParams } from "../../models/teams/TeamQueryParams";
import { Team } from "../../models/teams/Team";
import { TeamsService } from "../../services/teams/TeamsService";

@Controller("/team")
export class TeamsCtrl {
    constructor(private teamsService: TeamsService) {}

    @Get("/")
    @Summary("Returns teams")
    @Status(200, {
        description: "Success",
        type: Team,
        collectionType: Array,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getTeams(@QueryParams() queryParams: Partial<TeamQueryParams>): Promise<Team[]> {
        return this.teamsService.findTeams(queryParams);
    }

    @Post("/")
    @Summary("Adds a new team")
    @Status(200, {
        description: "Success",
        type: Team,
        collectionType: Team,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async addTeam(req: Req): Promise<Team | Error> {
        return this.teamsService.addTeam(req.body as Team);
    }

    @Get("/:teamId")
    @Summary("Returns a team by id")
    @Status(200, {
        description: "Success",
        type: Team,
        collectionType: Team,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getTeamById(@Required() @PathParams("teamId") teamId: string): Promise<Team> {
        return this.teamsService.findTeamById(teamId);
    }

    @Patch("/:teamId")
    @Summary("Updates a team")
    @Status(200, {
        description: "Success",
        type: Team,
        collectionType: Team,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async updateTeam(@Required() @PathParams("teamId") teamId: string, @BodyParams() reqBody): Promise<Team> {
        return this.teamsService.updateTeam(teamId, reqBody as Team);
    }

    @Delete("/:teamId")
    @Summary("Deletes a team")
    @Status(200, {
        description: "Success",
        type: Team,
        collectionType: Team,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async removeTeam(@Required() @PathParams("companyId") companyId: string): Promise<Team> {
        return this.teamsService.removeTeam(companyId);
    }
}
