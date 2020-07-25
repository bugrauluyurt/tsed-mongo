import { TeamUtils } from "../models/teams/Team.utils";

export const ERROR_TEAM_NAME_MISSING = "Team name missing.";
export const ERROR_TEAM_NAME_MIN_LENGTH = `Team name length should be at least ${TeamUtils.MIN_TEAM_NAME} characters long.`;
export const ERROR_TEAM_NAME_MAX_LENGTH = `Team name length should be at exceed ${TeamUtils.MAX_TEAM_NAME} characters.`;
export const ERROR_NOT_A_VALID_TEAM = "Team is not valid";
