import { Milestone } from "./Milestone";
import { Ref } from "@tsed/mongoose";
import { ProjectSection } from "../projectSections/ProjectSection";

export class MilestonesQueryParams extends Milestone {
    milestoneIds?: string; // comma separated values
    projectSection: string | Ref<ProjectSection>;
}
