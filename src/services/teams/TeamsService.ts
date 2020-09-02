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
import { TeamMember } from "../../models/teams/TeamMember";
import { ERROR_INVALID_USER_ID } from "../../errors/UsersError";
import { TeamRole } from "../../enums/TeamRole";
import { ERROR_INVALID_TEAM_ROLE } from "../../errors/TeamMemberError";
import { isValidMongoId } from "../../utils/isValidMongoId";
import { User, UserModel } from "../../models/users/User";
import { UsersService } from "../users/UsersService";

@Service()
export class TeamsService {
    private Team: MongooseModel<Team>;
    private User: MongooseModel<User>;

    constructor(private usersService: UsersService) {
        this.Team = TeamModel as MongooseModel<Team>;
        this.User = UserModel as MongooseModel<User>;
    }

    async findTeams(queryParams: Partial<TeamQueryParams>): Promise<Team[]> {
        const { modelSafeData } = getModelSafeData<TeamQueryParams>(queryParams, new TeamQueryParams(), [
            "teamMembers",
        ]);
        // @TODO: Normalize users if requested (Ex: return the actual user object instead of userId)
        const conditions = getSafeFindQueryConditions(modelSafeData, [["_id"]]);
        return await this.Team.aggregate([{ $match: conditions }]).exec();
    }

    async findTeamById(teamId: string): Promise<Team> {
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findById(teamId);
    }

    async addTeam(team: Partial<Team>): Promise<Team> {
        const { modelSafeData } = getModelSafeData<Team>(team, new Team());
        const model = new this.Team(modelSafeData);
        return await model.save().catch((err) => {
            throw new BadRequest(err);
        });
    }

    async updateTeam(teamId: string, teamPartial: Partial<Team>): Promise<Team> {
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        const { modelSafeData } = getModelSafeData(teamPartial, new Team());
        if (_.isEmpty(modelSafeData)) {
            throw new BadRequest(ERROR_NOT_A_VALID_TEAM);
        }
        return await this.Team.findByIdAndUpdate(teamId, modelSafeData, mongooseUpdateOptions)
            .exec()
            .catch((err) => {
                throw new BadRequest(err);
            });
    }

    async removeTeam(teamId: string): Promise<any> {
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_NO_TEAM_ID);
        }
        return await this.Team.findByIdAndDelete(teamId)
            .exec()
            .then(() => true)
            .catch(() => false);
    }

    async addTeamMember(teamId: string, teamMember: TeamMember): Promise<Team> {
        if (!isValidMongoId(teamMember?.userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        const { modelSafeData } = getModelSafeData<TeamMember>(teamMember, new TeamMember());
        if (!modelSafeData.teamRole) {
            modelSafeData.teamRole = TeamRole.GUEST;
        }
        return await this.Team.update(
            { _id: teamId },
            { $addToSet: { teamMembers: modelSafeData } },
            { runValidators: true }
        );
    }

    async removeTeamMember(teamId: string, userId: string): Promise<Team> {
        if (!isValidMongoId(userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        return await this.Team.update({ _id: teamId }, { $pull: { teamMembers: { userId } } }, { runValidators: true });
    }

    async updateTeamMemberRole(teamId: string, userId: string, teamRole: TeamRole): Promise<Team> {
        if (!isValidMongoId(userId)) {
            throw new BadRequest(ERROR_INVALID_USER_ID);
        }
        if (!isValidMongoId(teamId)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ID);
        }
        if (!_.some(_.values(TeamRole), (role) => role === teamRole)) {
            throw new BadRequest(ERROR_INVALID_TEAM_ROLE);
        }
        return await this.Team.update(
            { _id: teamId, "teamMembers.userId": userId },
            { $set: { "teamMembers.$.teamRole": teamRole } },
            { runValidators: true }
        );
    }
}
