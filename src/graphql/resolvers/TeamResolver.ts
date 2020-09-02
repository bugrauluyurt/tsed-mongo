import { ResolverService } from "@tsed/graphql";
import { TeamsService } from "../../services/teams/TeamsService";
import { Query, ArgsType, Args, ID, Field, Arg, Mutation, InputType } from "type-graphql";
import { Team } from "../../models/teams/Team";
import { TeamQueryParams } from "../../models/teams/TeamQueryParams";
import { TeamRole } from "../../enums/TeamRole";

@ArgsType()
class GetTeamsArgs implements Partial<TeamQueryParams> {
    @Field(() => ID)
    projectId: string;

    @Field(() => String, { nullable: true })
    teamName: string;
}

@InputType()
export class TeamMemberInput {
    @Field()
    userId: string;

    @Field(() => TeamRole, { defaultValue: TeamRole.GUEST })
    teamRole: TeamRole = TeamRole.GUEST;
}

@InputType({ description: "Add Team data" })
class AddTeamInput implements Partial<Team> {
    @Field(() => ID)
    projectId: string;

    @Field()
    teamName: string;

    @Field(() => [TeamMemberInput], { defaultValue: [] })
    teamMembers: TeamMemberInput[];
}

@InputType({ description: "Patch Team data" })
class PatchTeamInput implements Partial<Team> {
    @Field(() => ID)
    _id: string;

    @Field(() => String, { nullable: true })
    teamName: string;

    @Field(() => [TeamMemberInput], { nullable: true })
    teamMembers: TeamMemberInput[];
}

// Resolver
@ResolverService()
export class TeamResolver {
    constructor(private teamsService: TeamsService) {}

    @Query(() => [Team])
    async teams(@Args() queryParams: GetTeamsArgs): Promise<Team[]> {
        return await this.teamsService.findTeams(queryParams);
    }

    @Query(() => Team)
    async team(@Arg("_id") id: string): Promise<Team> {
        return await this.teamsService.findTeamById(id);
    }

    @Mutation(() => Team)
    async addTeam(@Arg("data") team: AddTeamInput): Promise<Team> {
        return await this.teamsService.addTeam(team);
    }

    @Mutation(() => Team)
    async patchTeam(@Arg("data") team: PatchTeamInput): Promise<Team> {
        return await this.teamsService.updateTeam(team._id, team);
    }

    @Mutation(() => Boolean)
    async removeTeam(@Arg("_id") id: string): Promise<boolean> {
        return await this.teamsService.removeTeam(id);
    }

    @Mutation(() => Team)
    async addTeamMember(@Arg("teamId") teamId: string, @Arg("data") teamMember: TeamMemberInput): Promise<Team> {
        return await this.teamsService.addTeamMember(teamId, teamMember);
    }

    @Mutation(() => Team)
    async removeTeamMember(@Arg("teamId") teamId: string, @Arg("userId") userId: string): Promise<Team> {
        return await this.teamsService.removeTeamMember(teamId, userId);
    }

    @Mutation(() => Team)
    async updateTeamMemberRole(
        @Arg("teamId") teamId: string,
        @Arg("userId") userId: string,
        @Arg("teamRole") teamRole: TeamRole
    ): Promise<Team> {
        return await this.teamsService.updateTeamMemberRole(teamId, userId, teamRole);
    }
}
