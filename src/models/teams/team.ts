import { Model, ObjectID, Ref } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { User } from "../users/User";

@Model()
export class Team {
    @ObjectID("id")
    _id: string;

    @Property()
    @Description("Team name")
    teamName: string;

    @Ref(User)
    @Description("Array of Users which belong to this team")
    teamMembers: Ref<User>[] = [];
}
