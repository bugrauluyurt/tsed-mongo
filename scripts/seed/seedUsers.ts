import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { Seed, SeedState } from "./seed";
import { IUser } from "../../src/interfaces/User";
import * as mongoose from "mongoose";
import { UserSchemaDefinition } from "../../src/models/users/User";

const defaultPassword = "12345";
const userSchema = new mongoose.Schema(UserSchemaDefinition);
const user = mongoose.model<IUser & mongoose.Document>("User", userSchema);

module.exports = (new Seed<IUser>(user, "Users", {documentCount: 50}))
    .beforeEach([bcrypt.hash(defaultPassword, 10)])
    .insertMany((
        beforeEachResponse: string[],
        index: number,
        seedState: SeedState,
        preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const [hashedPassword] = beforeEachResponse;
        const userCard = faker.helpers.userCard();
        return {
            name: userCard.name,
            email: userCard.email,
            password: hashedPassword,
            phone: userCard.phone,
            address: `${userCard.address.street} ${userCard.address.suite} ${userCard.address.city} ${userCard.address.zipcode}`,
        } as IUser;
    });
