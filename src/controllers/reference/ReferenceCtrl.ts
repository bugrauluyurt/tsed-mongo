import { Controller, Get, UseAuth, Status, QueryParams, PathParams, Required } from "@tsed/common";
import { Summary } from "@tsed/swagger";
import { UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { MilestoneStatusesService } from "../../services/milestoneStatuses/MilestoneStatusesService";
import { MilestoneStatus } from "../../models/milestoneStatuses/MilestoneStatus";

@Controller("/reference")
export class ReferenceCtrl {
    constructor(private milestoneStatusService: MilestoneStatusesService) {}

    @Get("/milestonestatus")
    @Summary("Returns milestoneStatuses")
    @Status(200, {
        description: "Success",
        type: MilestoneStatus,
        collectionType: Array,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getMilestoneStatuses(
        @QueryParams("milestoneStatusIds") milestoneStatusIds: string[],
        @QueryParams("name") milestoneName: string
    ): Promise<MilestoneStatus[]> {
        return this.milestoneStatusService.findMilestoneStatus(milestoneStatusIds, milestoneName);
    }

    @Get("/milestonestatus/:milestoneStatusId")
    @Summary("Returns milestoneStatus by id")
    @Status(200, {
        description: "Success",
        type: MilestoneStatus,
        collectionType: MilestoneStatus,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getMilestoneStatus(
        @Required() @PathParams("milestoneStatusId") milestoneStatusId: string
    ): Promise<MilestoneStatus> {
        return this.milestoneStatusService.findMilestoneStatusById(milestoneStatusId);
    }
}
