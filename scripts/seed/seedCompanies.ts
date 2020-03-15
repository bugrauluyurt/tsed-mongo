import * as faker from "faker";
import { Seed, SeedState } from "./seed";
import * as mongoose from "mongoose";
import { CompanySchemaDefinition, Company } from "../../src/models/companies/Company";
import * as _ from "lodash";
import { CompanyUtils } from "../../src/models/companies/Company.utils";

const companySchema = new mongoose.Schema(CompanySchemaDefinition);
const companyModel = mongoose.model<Company & mongoose.Document>("Company", companySchema);

module.exports = (new Seed<Company>(companyModel, "Companies", {documentCount: 10}))
    .insertMany((
        beforeEachResponse: string[],
        index: number,
        seedState: SeedState,
        preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const companyName = faker.fake("{{company.companyName}}");
        let domainNameBody = companyName.replace(/\W/ig, "");
        if (domainNameBody.length > CompanyUtils.MAX_DOMAIN_NAME) {
            const domainDefaultCharCount = 16;
            domainNameBody = domainNameBody.substr(0, CompanyUtils.MAX_DOMAIN_NAME - domainDefaultCharCount);
        }
        return {
            companyName,
            domain: `https://www.${_.toLower(domainNameBody)}.com`,
        } as Company;
    });
