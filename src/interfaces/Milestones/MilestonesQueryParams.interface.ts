import { Milestone } from "../../models/milestones/Milestone";

export interface IMilestonesQueryParams extends Milestone {
    milestoneIds: string; // comma separated values
}
