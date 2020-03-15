import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { Seed, SeedState } from "./seed";
import { IUser } from "../../src/models/users/User.interface";
import * as mongoose from "mongoose";
import { UserSchemaDefinition } from "../../src/models/users/User";
import { UserRole } from "../../src/models/users/UserRole";
import { getRandomUniqueSeedItems } from "./seedUtils";
import { UserUtils } from "../../src/models/users/User.utils";
import { CompanyUtils } from "../../src/models/companies/Company.utils";

const defaultPassword = "12345";
const userSchema = new mongoose.Schema(UserSchemaDefinition);
const userModel = mongoose.model<IUser & mongoose.Document>(UserUtils.COLLECTION_NAME, userSchema);

module.exports = (new Seed<IUser>(userModel, UserUtils.COLLECTION_NAME, {documentCount: 20}))
    .beforeEach([
        () => bcrypt.hash(defaultPassword, 10),
    ])
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
        const companies = seedState.getCollection(CompanyUtils.COLLECTION_NAME);
        const randomCompanyIds = getRandomUniqueSeedItems(companies, 1, false, CompanyUtils.COLLECTION_NAME);
        return {
            name: userCard.name,
            email: userCard.email,
            password: hashedPassword,
            phone: userCard.phone,
            address: `${userCard.address.street} ${userCard.address.suite} ${userCard.address.city} ${userCard.address.zipcode}`,
            companies: randomCompanyIds,
            roles: [UserRole.BASIC]
        } as IUser;
    });
