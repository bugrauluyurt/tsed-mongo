import * as faker from "faker";
import { Seed, SeedState } from "../seed";
import { IUser } from "../../../src/models/users/User.interface";
import * as mongoose from "mongoose";
import { UserSchemaDefinition } from "../../../src/models/users/User";
import { UserUtils } from "../../../src/models/users/User.utils";
import { createDefaultPassword, getRandomUniqueSeedItems } from "../seedUtils";
import { CompanyUtils } from "../../../src/models/companies/Company.utils";
import { UserRole } from "../../../src/models/users/UserRole";

const userSchema = new mongoose.Schema(UserSchemaDefinition);
const userModel = mongoose.model<IUser & mongoose.Document>(UserUtils.COLLECTION_NAME, userSchema);

const createUserDocumentTemplate = (hashedPassword: string, randomCompanyIds: string[] = []): IUser => {
    const userCard = faker.helpers.userCard();
    return {
        name: userCard.name,
        email: userCard.email,
        password: hashedPassword,
        phone: userCard.phone,
        address: `${userCard.address.street} ${userCard.address.suite} ${userCard.address.city} ${userCard.address.zipcode}`,
        companies: randomCompanyIds,
        roles: [UserRole.BASIC],
    } as IUser;
};

module.exports = {
    schema: userSchema,
    model: userModel,
    createTemplate: createUserDocumentTemplate,
    seed: new Seed<IUser>(userModel, UserUtils.COLLECTION_NAME, { documentCount: 20 })
        .beforeEach([(): Promise<string> => createDefaultPassword()])
        .insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
            // INFO
            // Previous seeded collections can be reached at each document level by using seedState instance.
            // seedState.getState() OR seedState.getCollection(collectionName)
            const [hashedPassword] = beforeEachResponse;
            const companies = seedState.getCollection(CompanyUtils.COLLECTION_NAME);
            const randomCompanyIds = getRandomUniqueSeedItems(companies, 1, false, CompanyUtils.COLLECTION_NAME);
            return createUserDocumentTemplate(hashedPassword, randomCompanyIds);
        }),
};
