import { ResolverService } from "@tsed/graphql";
import { TeamsService } from "../../services/teams/TeamsService";
import { Query, ArgsType, Args, ID, Field } from "type-graphql";
import { Team } from "../../models/teams/Team";
import { TeamQueryParams } from "../../models/teams/TeamQueryParams";

@ArgsType()
class GetTeamsArgs implements Partial<TeamQueryParams> {
    @Field(() => ID)
    projectId: string;

    @Field(() => String, { nullable: true })
    teamName: string;
}

// Resolver
@ResolverService()
export class TeamResolver {
    constructor(private teamsService: TeamsService) {}

    @Query(() => [Team])
    async teams(@Args() queryParams: GetTeamsArgs): Promise<Team[]> {
        return await this.teamsService.findTeams(queryParams);
    }
}
