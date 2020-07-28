import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { MaxLength, MinLength, Property, Required, Default } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { UserModel } from "../users/User";
import * as mongoose from "mongoose";
import {
    ERROR_TEAM_NAME_MISSING,
    ERROR_TEAM_NAME_MIN_LENGTH,
    ERROR_TEAM_NAME_MAX_LENGTH,
} from "../../errors/TeamsError";
import { TeamUtils } from "./Team.utils";
import { ERROR_USER_MISSING, ERROR_INVALID_USER_ID } from "../../errors/UsersError";
import { ERROR_NO_PROJECT, ERROR_NOT_VALID_PROJECT_ID } from "../../errors/ProjectsError";
import { NotFound, BadRequest } from "ts-httpexceptions";
import { ProjectModel } from "../projects/Project";
import * as _ from "lodash";
import validator from "validator";
import { TeamMember } from "./TeamMember";
import {
    ERROR_TEAM_MEMBERS_NOT_VALID,
    ERROR_TEAM_MEMBERS_DUPLICATE,
    ERROR_TEAM_MEMBER_ROLE_INVALID,
} from "../../errors/TeamMemberError";
import { Schema, HookNextFunction } from "mongoose";
import { getModelSafeData } from "../../utils/getModelSafeData";
import { TeamRole } from "../../enums/TeamRole";

@MongooseSchema()
export class Team {
    @ObjectID("id")
    _id: string = null;

    @Required()
    @Description("ProjectId of the project where this team belongs to")
    projectId: string = null;

    @Property()
    @Required()
    @MinLength(TeamUtils.MIN_TEAM_NAME)
    @MaxLength(TeamUtils.MAX_TEAM_NAME)
    @Description("Team name")
    teamName: string = null;

    @Property()
    @Default([])
    @Description("Array of TeamMembers which belong to this team")
    teamMembers: TeamMember[] = [];
}

// Schema Definition
export const TeamSchemaDefinition = {
    projectId: {
        type: String,
        required: [true, ERROR_NO_PROJECT],
        validate: {
            validator: function (projectId: string): Promise<boolean> {
                return new Promise(function (resolve, reject) {
                    if (!validator.isMongoId(projectId) || _.isUndefined(projectId)) {
                        return reject(new NotFound(ERROR_NOT_VALID_PROJECT_ID));
                    }
                    ProjectModel.findById(projectId).exec((err) => {
                        if (err) {
                            reject(new NotFound(ERROR_NO_PROJECT));
                        }
                        resolve(true);
                    });
                });
            },
            message: ERROR_NO_PROJECT,
        },
    },
    teamName: {
        type: String,
        required: [true, ERROR_TEAM_NAME_MISSING],
        minLength: [TeamUtils.MIN_TEAM_NAME, ERROR_TEAM_NAME_MIN_LENGTH],
        maxLength: [TeamUtils.MAX_TEAM_NAME, ERROR_TEAM_NAME_MAX_LENGTH],
    },
    teamMembers: {
        type: [
            {
                type: Schema.Types.Mixed,
                validator: function (teamMember: TeamMember): Promise<boolean> {
                    return new Promise((resolve, reject) => {
                        if (!validator.isMongoId(teamMember?.userId)) {
                            return reject(new BadRequest(ERROR_INVALID_USER_ID));
                        }
                        UserModel.findById(teamMember?.userId).exec((err) => {
                            if (err) {
                                reject(new BadRequest(ERROR_USER_MISSING));
                            }
                            resolve(true);
                        });
                    });
                },
            },
        ],
        validate: {
            validator: function (teamMembers: TeamMember[]): Promise<boolean> {
                // Check for duplicated teamMember and their objectID integrity
                return new Promise((resolve, reject) => {
                    _.reduce(
                        teamMembers,
                        (acc, teamMember) => {
                            if (acc[teamMember?.userId]) {
                                return reject(new BadRequest(ERROR_TEAM_MEMBERS_DUPLICATE));
                            }
                            if (!validator.isMongoId(teamMember?.userId)) {
                                return reject(new BadRequest(ERROR_INVALID_USER_ID));
                            }
                            return { ...acc, [teamMember?.userId]: teamMember };
                        },
                        {}
                    );
                    resolve(true);
                });
            },
            message: ERROR_TEAM_MEMBERS_NOT_VALID,
        },
        default: [],
    },
};

export const TeamSchema = new mongoose.Schema(TeamSchemaDefinition, { versionKey: false });

// Hooks
TeamSchema.pre<Team & mongoose.Document>("save", async function (next: HookNextFunction) {
    this.teamMembers = _.map(this.teamMembers, (teamMember) => {
        const { modelSafeData } = getModelSafeData<TeamMember>(teamMember, new TeamMember());
        if (_.isEmpty(modelSafeData)) {
            throw new BadRequest(ERROR_TEAM_MEMBERS_NOT_VALID);
        }
        if (modelSafeData?.teamRole) {
            if (!_.includes(_.values(TeamRole), teamMember?.teamRole)) {
                throw new BadRequest(ERROR_TEAM_MEMBER_ROLE_INVALID);
            }
            return modelSafeData;
        }
        modelSafeData.teamRole = TeamRole.GUEST;
        return modelSafeData;
    });
    next();
});

export const TeamModel = mongoose.model<Team & mongoose.Document>(TeamUtils.MODEL_NAME, TeamSchema);
