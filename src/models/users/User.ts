import { Model, ObjectID, Unique } from "@tsed/mongoose";
import { IgnoreProperty, MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";

@Model()
export class User {
    @ObjectID("id")
    _id: string;

    @Property()
    @Description("Name of the user")
    name: string;

    @MinLength(10)
    @MaxLength(100)
    @Unique()
    @Required()
    @Description("Email of the user")
    email: string;

    @IgnoreProperty()
    @Description("Password of the user")
    password: string;

    @Property()
    @Description("Phone number")
    phone: string;

    @Property()
    @Description("Address")
    address: string;
}

// [SEED] Schema Definition
export const UserSchemaDefinition = {
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
};

