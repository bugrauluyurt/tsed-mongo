import { ObjectID, Model } from "@tsed/mongoose";
import { Property, Required } from "@tsed/common";

@Model()
export class ProjectType {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    name: string;
}
