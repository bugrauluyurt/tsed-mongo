import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { BadRequest } from "ts-httpexceptions";
import { isMongoId } from "class-validator";
import { getModelSafeData } from "../../../utils/getModelSafeData";
import { getSafeFindQueryConditions } from "../../../utils/getSafeFindQueryConditions";
import { Team, TeamModel } from "../../models/teams/Team";
import { TeamQueryParams } from "../../models/teams/TeamQueryParams";
import { ERROR_NO_TEAM_ID } from "../../errors/ProjectsError";
import { ERROR_NOT_A_VALID_TEAM } from "../../errors/TeamsError";
import { mongooseUpdateOptions } from "../../../utils/mongooseUpdateOptions";
import * as _ from "lodash";

@Service()
export class TeamsService {
    private Team: MongooseModel<Team>;

    constructor() {
        this.Team = TeamModel as MongooseModel<Team>;
    }

    async findTeams(queryParams: Partial<TeamQueryParams>): Promise<Team[]> {
        const { modelSafeData } = getModelSafeData<TeamQueryParams>(queryParams, new TeamQueryParams(), [
            "teamMembers",
        ]);
        const conditions = getSafeFindQueryConditions(modelSafeData, [["_id", "companyIds"]]);
        return await this.Team.find(conditions).exec();
    }

    async findTeamById(teamId: string): Promise<Team> {
        if (!isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findById(teamId);
    }

    async addTeam(team: Team): Promise<Team | Error> {
        const model = new this.Team(getModelSafeData<Team>(team, new Team()));
        return await model.save().catch(() => new BadRequest(ERROR_NOT_A_VALID_TEAM));
    }

    async updateTeam(teamId: string, teamPartial: Partial<Team>): Promise<Team> {
        if (!isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        const { modelSafeData } = getModelSafeData(teamPartial, new Team());
        if (_.isEmpty(modelSafeData)) {
            throw new BadRequest(ERROR_NOT_A_VALID_TEAM);
        }
        return await this.Team.findByIdAndUpdate(teamId, modelSafeData, mongooseUpdateOptions).exec();
    }

    async removeTeam(teamId: string): Promise<any> {
        if (!isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findByIdAndDelete(teamId).exec();
    }
}
