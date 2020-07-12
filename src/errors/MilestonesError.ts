import { MilestoneUtils } from "../models/milestones/Milestone.utils";

export const ERROR_MILESTONE_ID_MISSING = "Milestone id missing.";
export const ERROR_MILESTONE_NAME_MISSING = "Milestone name missing.";
export const ERROR_MILESTONE_NAME_MIN_LENGTH = `Milestone name should be min ${MilestoneUtils.MILESTONE_NAME_MIN_LENGTH} characters.`;
export const ERROR_MILESTONE_NAME_MAX_LENGTH = `Milestone name should be max ${MilestoneUtils.MILESTONE_NAME_MAX_LENGTH} characters long.`;
export const ERROR_MILESTONE_WEIGHT_MIN = `Milestone weight should be min ${MilestoneUtils.MILESTONE_WEIGHT_MIN}.`;
export const ERROR_MILESTONE_WEIGHT_MAX = `Milestone weight should be max ${MilestoneUtils.MILESTONE_WEIGHT_MAX}.`;
export const ERROR_MILESTONE_QUERY_PARAM_MISSING = `Milestone queryparams should have either milestoneIds or projectsectionId`;

export const ERROR_DATE_ORDER = "endDate should be after startDate.";
