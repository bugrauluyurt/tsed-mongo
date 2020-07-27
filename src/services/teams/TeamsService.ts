import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { BadRequest } from "ts-httpexceptions";
import { getModelSafeData } from "../../utils/getModelSafeData";
import { getSafeFindQueryConditions } from "../../utils/getSafeFindQueryConditions";
import { Team, TeamModel } from "../../models/teams/Team";
import { TeamQueryParams } from "../../models/teams/TeamQueryParams";
import { ERROR_NO_TEAM_ID, ERROR_INVALID_TEAM_ID } from "../../errors/ProjectsError";
import { ERROR_NOT_A_VALID_TEAM } from "../../errors/TeamsError";
import { mongooseUpdateOptions } from "../../utils/mongooseUpdateOptions";
import * as _ from "lodash";
import validator from "validator";
import { TeamMember } from "../../models/teams/TeamMember";
import { ERROR_INVALID_USER_ID } from "../../errors/UsersError";
import { TeamRole } from "../../enums/TeamRole";
import { ERROR_INVALID_TEAM_ROLE } from "../../errors/TeamMemberError";
import { PageSizes } from "../../enums/PageSizes";

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
        return await this.Team.find(conditions).limit(PageSizes.HUNDRED).exec();
    }

    async findTeamById(teamId: string): Promise<Team> {
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findById(teamId);
    }

    async addTeam(team: Team): Promise<Team | Error> {
        const { modelSafeData } = getModelSafeData<Team>(team, new Team());
        const model = new this.Team(modelSafeData);
        return await model.save({ validateBeforeSave: true });
    }

    async updateTeam(teamId: string, teamPartial: Partial<Team>): Promise<Team> {
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        const { modelSafeData } = getModelSafeData(teamPartial, new Team());
        if (_.isEmpty(modelSafeData)) {
            throw new BadRequest(ERROR_NOT_A_VALID_TEAM);
        }
        return await this.Team.findByIdAndUpdate(teamId, modelSafeData, mongooseUpdateOptions).exec();
    }

    async removeTeam(teamId: string): Promise<any> {
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findByIdAndDelete(teamId).exec();
    }

    async addTeamMember(teamId: string, teamMember: TeamMember): Promise<TeamMember> {
        if (!validator.isMongoId(teamMember?.userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        const { modelSafeData } = getModelSafeData<TeamMember>(teamMember, new TeamMember());
        if (!modelSafeData.teamRole) {
            modelSafeData.teamRole = TeamRole.GUEST;
        }
        return await this.Team.update(
            { _id: teamId },
            { $addToSet: { teamMembers: modelSafeData as TeamMember } },
            { runValidators: true }
        );
    }

    async removeTeamMember(teamId: string, userId: string): Promise<TeamMember> {
        if (!validator.isMongoId(userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        return await this.Team.update({ _id: teamId }, { $pull: { teamMembers: { userId } } });
    }

    async updateTeamMemberRole(teamId: string, userId: string, teamRole: TeamRole): Promise<TeamMember> {
        if (!validator.isMongoId(userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!validator.isMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        if (!_.some(_.values(teamRole), (role) => role === teamRole)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ROLE);
        }
        return await this.Team.update(
            { _id: teamId, "teamMembers.userId": userId },
            { $set: { "teamMembers.$.teamRole": teamRole } }
        );
    }
}
