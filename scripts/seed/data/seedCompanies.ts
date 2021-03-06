/* eslint-disable @typescript-eslint/no-var-requires */
import * as faker from "faker";
import { Seed, SeedState } from "../seed";
import * as mongoose from "mongoose";
import { Company, CompanyModel } from "../../../src/models/companies/Company";
import * as _ from "lodash";
import { CompanyUtils } from "../../../src/models/companies/Company.utils";
import { UserRole } from "../../../src/models/users/UserRole";
import { ADMIN_USER_NAME, createAdminPassword } from "../seedUtils";
import { User, UserModel } from "../../../src/models/users/User";
import { ProjectTypeUtils } from "../../../src/models/projectTypes/ProjectType.utils";
import { logWithColor } from "../../../src/utils/default";
import { ProjectUtils } from "../../../src/models/projects/Project.utils";
import { ProjectModel } from "../../../src/models/projects/Project";
import { UserCompanyRole } from "../../../src/models/users/UserCompanyRole";
import { TeamModel } from "../../../src/models/teams/Team";

const seedUsers = require("./seedUsers");
const seedProjects = require("./seedProjects");
const seedTeams = require("./seedTeams");

const domainDefaultCharCount = 16;

const createFakeDomainName = (companyName: string, includeWebSignature = true): string => {
    let domainNameBody = companyName.replace(/\W/gi, "");
    if (domainNameBody.length > CompanyUtils.MAX_DOMAIN_NAME) {
        domainNameBody = domainNameBody.substr(0, CompanyUtils.MAX_DOMAIN_NAME - domainDefaultCharCount);
    }
    const lowerCasedDomainNameBody = _.toLower(domainNameBody);
    if (!includeWebSignature) {
        return lowerCasedDomainNameBody;
    }
    return `https://www.${lowerCasedDomainNameBody}.com`;
};

const createCompanyAdmin = (documentIndex: number, company: Company): Promise<mongoose.Document | User> => {
    return createAdminPassword().then((hashedPassword: string) => {
        const userDocumentTemplate = seedUsers.createTemplate(hashedPassword);
        const fakeDomainName = createFakeDomainName(company.companyName, false);
        userDocumentTemplate.name = ADMIN_USER_NAME;
        userDocumentTemplate.password = hashedPassword;
        userDocumentTemplate.email = `${ADMIN_USER_NAME}@${fakeDomainName}.com`;
        userDocumentTemplate.companies = [company._id];
        userDocumentTemplate.roles = [UserRole.GENERAL];
        userDocumentTemplate.companyRoles = [UserCompanyRole.COMPANY_ADMIN];
        return UserModel.create(userDocumentTemplate);
    });
};

module.exports = {
    seed: new Seed<Company>(CompanyModel, CompanyUtils.COLLECTION_NAME, { documentCount: 20 })
        .preSeed(Promise.all([ProjectModel.deleteMany({}).exec(), TeamModel.deleteMany({}).exec()]))
        .insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
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
                const projectTypes = seedState.getCollection(ProjectTypeUtils.COLLECTION_NAME);
                return Promise.resolve(true)
                    .then(() => createCompanyAdmin(documentIndex, createdCompany))
                    .then((projectAdmin: User) => {
                        logWithColor(
                            "[SEED]",
                            `Seeding [${ProjectUtils.COLLECTION_NAME}] for [Company] -> ${createdCompany.companyName} into database...`,
                            false
                        );
                        return projectAdmin;
                    })
                    .then((projectAdmin) =>
                        seedProjects.createProjects(projectAdmin, createdCompany, seedState, projectTypes)
                    )
                    .then((projects) => seedTeams.createTeams(projects));
            },
        ]),
};
