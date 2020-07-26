import { TeamRole } from "../../enums/TeamRole";
export class TeamMember {
    userId: string;
    teamRole: TeamRole = TeamRole.GUEST;
}
