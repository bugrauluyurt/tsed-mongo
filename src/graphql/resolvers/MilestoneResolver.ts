import { ResolverService } from "@tsed/graphql";
import { Milestone } from "../../models/milestones/Milestone";
import { MilestonesService } from "../../services/milestones/MilestonesService";
import { Query, ArgsType, Args, ID, Field, Arg, Mutation, InputType, Int } from "type-graphql";
import { MaxLength, MinLength, Min, Max } from "class-validator";
import {
    ERROR_MILESTONE_NAME_MAX_LENGTH,
    ERROR_MILESTONE_NAME_MIN_LENGTH,
    ERROR_MILESTONE_BODY_MAX_LENGTH,
    ERROR_MILESTONE_BODY_MIN_LENGTH,
} from "../../errors/MilestonesError";
import { MilestoneUtils } from "../../models/milestones/Milestone.utils";
import { MilestoneTags } from "../../enums/MilestoneTags";
import { Priority } from "../../enums/Priority";

// ArgTypes
@ArgsType()
class GetMilestonesArgs {
    @Field(() => ID, { nullable: true })
    projectSection: string;

    @Field(() => String, { nullable: true })
    milestoneIds: string;
}

// InputTypes
@InputType({ description: "Milestone generic input" })
class MilestoneInput implements Partial<Milestone> {
    @Field(() => ID)
    projectSection: string;

    @Field()
    @MaxLength(MilestoneUtils.MILESTONE_NAME_MAX_LENGTH, {
        message: ERROR_MILESTONE_NAME_MAX_LENGTH,
    })
    @MinLength(MilestoneUtils.MILESTONE_NAME_MIN_LENGTH, {
        message: ERROR_MILESTONE_NAME_MIN_LENGTH,
    })
    milestoneName: string;

    @Field(() => String, { nullable: true })
    @MaxLength(MilestoneUtils.MILESTONE_BODY_MAX_LENGTH, {
        message: ERROR_MILESTONE_BODY_MAX_LENGTH,
    })
    @MinLength(MilestoneUtils.MILESTONE_BODY_MIN_LENGTH, {
        message: ERROR_MILESTONE_BODY_MIN_LENGTH,
    })
    milestoneBody: string;

    @Field(() => Date, { nullable: true })
    startDate: Date = null;

    @Field(() => Date, { nullable: true })
    endDate: Date = null;

    @Field(() => String, { nullable: true })
    status: string;

    @Field(() => [MilestoneTags], { defaultValue: [MilestoneTags.GENERIC] })
    tags: MilestoneTags[];

    @Field(() => Priority, { defaultValue: Priority.MEDIUM })
    priority: Priority = Priority.MEDIUM;

    @Field(() => Int, { defaultValue: 0 })
    sequence = 0;

    @Field(() => Int, { defaultValue: 1 })
    @Min(MilestoneUtils.MILESTONE_WEIGHT_MIN)
    @Max(MilestoneUtils.MILESTONE_WEIGHT_MAX)
    weight = 1;
}

@InputType({ description: "Add Milestone data" })
class AddMilestoneInput extends MilestoneInput implements Partial<Milestone> {}

@InputType({ description: "Patch Milestone data" })
class PatchMilestoneInput extends MilestoneInput implements Partial<Milestone> {
    @Field(() => ID)
    _id: string;

    @Field(() => String, { nullable: true })
    @MaxLength(MilestoneUtils.MILESTONE_NAME_MAX_LENGTH, {
        message: ERROR_MILESTONE_NAME_MAX_LENGTH,
    })
    @MinLength(MilestoneUtils.MILESTONE_NAME_MIN_LENGTH, {
        message: ERROR_MILESTONE_NAME_MIN_LENGTH,
    })
    milestoneName: string;

    @Field(() => [MilestoneTags], { nullable: true })
    tags: MilestoneTags[];

    @Field(() => Priority, { nullable: true })
    priority: Priority;

    @Field(() => Int, { nullable: true })
    sequence: number;

    @Field(() => Int, { nullable: true })
    @Min(MilestoneUtils.MILESTONE_WEIGHT_MIN)
    @Max(MilestoneUtils.MILESTONE_WEIGHT_MAX)
    weight: number;
}

// Resolver
@ResolverService(Milestone)
export class MilestoneResolver {
    constructor(private milestonesService: MilestonesService) {}

    @Query(() => [Milestone])
    async milestones(@Args() milestoneArgs: GetMilestonesArgs): Promise<Milestone[]> {
        return this.milestonesService.getMilestones(milestoneArgs);
    }

    @Mutation(() => Milestone)
    async addMilestone(@Arg("data") milestone: AddMilestoneInput): Promise<Milestone> {
        return this.milestonesService.addMilestone(milestone);
    }

    @Mutation(() => Milestone)
    async patchMilestone(@Arg("data") milestone: PatchMilestoneInput): Promise<Milestone> {
        return this.milestonesService.patchMilestone(milestone._id, milestone);
    }
}
