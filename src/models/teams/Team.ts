import { Model, ObjectID, PreHook, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { User } from "../users/User";
import { Schema } from "mongoose";
import { UserUtils } from "../users/User.utils";
import * as _ from "lodash";

@Model()
export class Team {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    @Description("Team name")
    teamName: string;

    @Ref(User)
    @Description("Array of Users which belong to this team")
    teamMembers: Ref<User>[] = [];

    @PreHook("save")
    static preSave(team: Team, next) {
        if (_.isEmpty(team.teamMembers)) {
            team.teamMembers = [];
        }
        next();
    }
}

// [SEED] Schema Definition
export const TeamSchemaDefinition = {
    teamName: String,
    teamMembers: [{ type: Schema.Types.ObjectId, ref: UserUtils.MODEL_NAME }],
};
