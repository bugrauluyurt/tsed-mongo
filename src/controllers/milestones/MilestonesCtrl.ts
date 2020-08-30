import { Controller, Post, Req, Status, UseAuth, Get, QueryParams, BodyParams, PathParams, Patch } from "@tsed/common";
import { Summary } from "@tsed/swagger";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { UserRolesAll } from "../../models/users/UserRole";
import { MilestonesService } from "../../services/milestones/MilestonesService";
import { Milestone } from "../../models/milestones/Milestone";

@Controller("/milestones")
export class MilestonesCtrl {
    constructor(private milestonesServices: MilestonesService) {}

    // @TODO: User should be a part of the company that this milestone belongs
    @Get("/")
    @Summary("Get a milestones with projectSectionId")
    @Status(200, {
        description: "Success",
        type: Milestone,
        collectionType: Milestone,
    })
    @UseAuth(AuthMiddleware)
    async getMilestones(@QueryParams() queryParams: object): Promise<Milestone[]> {
        return this.milestonesServices.getMilestones(queryParams);
    }

    @Post("/add")
    @Summary("Adds a milestone")
    @Status(200, {
        description: "Success",
        type: Milestone,
        collectionType: Milestone,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async addMilestone(req: Req): Promise<Milestone> {
        return this.milestonesServices.addMilestone(req.body as Milestone);
    }

    @Patch("/:milestoneId/update")
    @Summary("Update a milestone")
    @Status(200, {
        description: "Success",
        type: Milestone,
        collectionType: Milestone,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async patchMilestone(
        @BodyParams() payload: Partial<Milestone>,
        @PathParams("milestoneId") milestoneId: string
    ): Promise<Milestone> {
        return this.milestonesServices.patchMilestone(milestoneId, payload as Partial<Milestone>);
    }
}
