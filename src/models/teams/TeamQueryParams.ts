import { Team } from "./Team";

export class TeamQueryParams extends Team {
    shouldDeserializeUsers = false;
}
