import * as faker from "faker";
import { Team, TeamModel } from "../../../src/models/teams/Team";
import { TeamUtils } from "../../../src/models/teams/Team.utils";
import * as _ from "lodash";
import { Project } from "../../../src/models/projects/Project";

export const createTeams = (projects: Project[]): Promise<Team[]> => {
    const teams: Promise<Team>[] = _.map(projects, (project) => {
        return new TeamModel({
            projectId: project._id,
            teamName: `${TeamUtils.MODEL_NAME}_${project.projectName}`,
        }).save({ validateBeforeSave: true });
    });
    return Promise.all(teams);
};
