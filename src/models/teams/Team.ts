import { MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { User } from "../users/User";
import * as mongoose from "mongoose";
import { UserUtils } from "../users/User.utils";
import {
    ERROR_TEAM_NAME_MISSING,
    ERROR_TEAM_NAME_MIN_LENGTH,
    ERROR_TEAM_NAME_MAX_LENGTH,
} from "../../errors/TeamsError";
import { TeamUtils } from "./Team.utils";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ERROR_USER_MISSING } from "../../errors/UsersError";

@MongooseSchema()
export class Team {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    @MinLength(TeamUtils.MIN_TEAM_NAME)
    @MaxLength(TeamUtils.MAX_TEAM_NAME)
    @Description("Team name")
    teamName: string;

    @Ref(User)
    @Description("Array of Users which belong to this team")
    teamMembers: Ref<User>[] = [];
}

// Schema Definition
export const TeamSchemaDefinition = {
    teamName: {
        type: String,
        required: [true, ERROR_TEAM_NAME_MISSING],
        minLength: [TeamUtils.MIN_TEAM_NAME, ERROR_TEAM_NAME_MIN_LENGTH],
        maxLength: [TeamUtils.MAX_TEAM_NAME, ERROR_TEAM_NAME_MAX_LENGTH],
    },
    teamMembers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: UserUtils.MODEL_NAME,
                validate: getForeignKeyValidator.call(this, UserUtils.MODEL_NAME, ERROR_USER_MISSING),
            },
        ],
        default: [],
    },
};

export const TeamSchema = new mongoose.Schema(TeamSchemaDefinition, { versionKey: false });
export const TeamModel = mongoose.model<Team & mongoose.Document>(TeamUtils.MODEL_NAME, TeamSchema);
