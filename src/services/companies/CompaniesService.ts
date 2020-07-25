import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { Company, CompanyModel } from "../../models/companies/Company";
import { sanitizeModelBody } from "../../../utils/sanitizeModelBody";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_NO_COMPANY_ID, ERROR_NO_COMPANY, ERROR_NOT_VALID_COMPANY } from "../../errors/CompaniesError";
import { mongooseUpdateOptions } from "../../../utils/mongooseUpdateOptions";
import { isMongoId } from "class-validator";
import { CompanyQueryParams } from "../../models/companies/CompanyQueryParams";
import { getModelSafeData } from "../../../utils/getModelSafeData";
import { getSafeFindQueryConditions } from "../../../utils/getSafeFindQueryConditions";
import * as _ from "lodash";
import { IntegrityCompany, IntegrityCompanyModel } from "../../models/integrity/IntegrityCompany";
import { ERROR_NO_DATE } from "../../errors/DateError";

@Service()
export class CompaniesService {
    private Company: MongooseModel<Company>;
    private IntegrityCompany: MongooseModel<IntegrityCompany>;

    constructor() {
        this.Company = CompanyModel as MongooseModel<Company>;
        this.IntegrityCompany = IntegrityCompanyModel as MongooseModel<IntegrityCompany>;
    }

    async findCompanies(queryParams: Partial<CompanyQueryParams>): Promise<Company[]> {
        const { modelSafeData, otherData } = getModelSafeData<CompanyQueryParams>(
            queryParams,
            new CompanyQueryParams()
        );
        const conditions = getSafeFindQueryConditions(modelSafeData, [["_id", "companyIds"]]);
        return await this.Company.find(conditions)
            .skip(otherData.page * otherData.pageSize)
            .limit(otherData.pageSize)
            .exec();
    }

    async findCompanyById(companyId: string): Promise<Company> {
        return this.Company.findById(companyId);
    }

    async addCompany(company: Company): Promise<Company | Error> {
        const model = new this.Company(sanitizeModelBody<Company>(company));
        return await model.save().catch(() => new BadRequest(ERROR_NOT_VALID_COMPANY));
    }

    async updateCompany(companyId: string, companyPartial: Partial<Company>): Promise<Company> {
        if (!isMongoId(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const { modelSafeData } = getModelSafeData(companyPartial, new Company());
        if (_.isEmpty(modelSafeData)) {
            throw new BadRequest(ERROR_NOT_VALID_COMPANY);
        }
        return await this.Company.findByIdAndUpdate(
            companyId,
            sanitizeModelBody(companyPartial),
            mongooseUpdateOptions
        ).exec();
    }

    async removeCompany(companyId: string): Promise<any> {
        if (!isMongoId(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const company = await this.Company.findById(companyId);
        if (!company) {
            throw new BadRequest(ERROR_NO_COMPANY);
        }
        const integrityCompanyModel = new this.IntegrityCompany(sanitizeModelBody({ companyId }));
        return await Promise.all([
            this.Company.findByIdAndDelete(companyId).exec(),
            integrityCompanyModel.save().catch(() => new BadRequest(ERROR_NO_DATE)),
        ]);
    }
}
