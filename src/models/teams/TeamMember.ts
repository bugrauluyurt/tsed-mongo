import { TeamRole } from "../../enums/TeamRole";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class TeamMember {
    @Field(() => ID)
    userId: string = null;

    @Field(() => TeamRole, { defaultValue: TeamRole.GUEST })
    teamRole: TeamRole = TeamRole.GUEST;
}
