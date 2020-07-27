import { TeamRole } from "../../enums/TeamRole";
export class TeamMember {
    userId: string = null;
    teamRole: TeamRole = TeamRole.GUEST;
}
