import { ResolverService } from "@tsed/graphql";
import { MilestoneStatusesService } from "../../services/milestoneStatuses/MilestoneStatusesService";
import { Query, ArgsType, Args, ID, Field, Arg, Mutation, InputType, Int } from "type-graphql";
import { MilestoneStatus } from "../../models/milestoneStatuses/MilestoneStatus";

// Resolver
@ResolverService()
export class ReferenceResolver {
    constructor(private milestoneStatusService: MilestoneStatusesService) {}

    @Query(() => MilestoneStatus)
    async milestonestatus(@Arg("milestoneStatusId") milestoneStatusId: string): Promise<MilestoneStatus> {
        return await this.milestoneStatusService.findMilestoneStatusById(milestoneStatusId);
    }

    @Query(() => [MilestoneStatus])
    async milestonestatuses(
        @Arg("milestoneStatusIds", { nullable: true }) milestoneStatusIds: string,
        @Arg("name", { nullable: true }) name: string
    ): Promise<MilestoneStatus[]> {
        return await this.milestoneStatusService.findMilestoneStatus(milestoneStatusIds, name);
    }
}
