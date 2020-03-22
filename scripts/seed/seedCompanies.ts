import * as faker from "faker";
import { Seed, SeedState } from "./seed";
import * as mongoose from "mongoose";
import { Company, CompanySchemaDefinition } from "../../src/models/companies/Company";
import * as _ from "lodash";
import { CompanyUtils } from "../../src/models/companies/Company.utils";
import { UserRole } from "../../src/models/users/UserRole";
import { ADMIN_USER_NAME, createAdminPassword } from "./seedUtils";
import { User } from "../../src/models/users/User";
const seedUsers = require("./seedUsers");

const companySchema = new mongoose.Schema(CompanySchemaDefinition);
const companyModel = mongoose.model<Company & mongoose.Document>(CompanyUtils.MODEL_NAME, companySchema);
const domainDefaultCharCount = 16;

const createFakeDomainName = (companyName: string, includeWebSignature: boolean = true): string => {
    let domainNameBody = companyName.replace(/\W/ig, "");
    if (domainNameBody.length > CompanyUtils.MAX_DOMAIN_NAME) {
        domainNameBody = domainNameBody.substr(0, CompanyUtils.MAX_DOMAIN_NAME - domainDefaultCharCount);
    }
    const lowerCasedDomainNameBody = _.toLower(domainNameBody);
    if (!includeWebSignature) {
        return lowerCasedDomainNameBody;
    }
    return `https://www.${lowerCasedDomainNameBody}.com`;
};

const createCompanyProjectAdmin = (documentIndex: number, company: Company): Promise<User> => {
    return createAdminPassword()
        .then((hashedPassword: string) => {
            const userDocumentTemplate = seedUsers.createTemplate(hashedPassword);
            const fakeDomainName = createFakeDomainName(company.companyName, false);
            userDocumentTemplate.name = ADMIN_USER_NAME;
            userDocumentTemplate.password = hashedPassword;
            userDocumentTemplate.email = `${ADMIN_USER_NAME}@${fakeDomainName}.com`;
            userDocumentTemplate.companies = [company._id];
            userDocumentTemplate.roles = [UserRole.PROJECT_ADMIN];
            return seedUsers.model.create(userDocumentTemplate);
        });
};

module.exports = {
    schema: companySchema,
    model: companyModel,
    seed: (new Seed<Company>(companyModel, CompanyUtils.COLLECTION_NAME, {documentCount: 20}))
        .insertMany((
            beforeEachResponse: string[],
            index: number,
            seedState: SeedState,
            preSeedResponse) => {
            // INFO
            // Previous seeded collections can be reached at each document level by using seedState instance.
            // seedState.getState() OR seedState.getCollection(collectionName)
            const companyName = faker.fake("{{company.companyName}}");
            return {
                companyName,
                domain: createFakeDomainName(companyName),
            } as Company;
        })
        .afterEach([
            (documentIndex: number, createdCompany: Company, seedState: SeedState): Promise<any> => {
                return createCompanyProjectAdmin(documentIndex, createdCompany);
            }
        ]),
};
