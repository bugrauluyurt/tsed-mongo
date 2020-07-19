import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { Company, CompanyModel } from "../../models/companies/Company";
import { sanitizeModelBody } from "../../../utils/sanitizeUpdateBody";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_NO_COMPANY_ID, ERROR_NO_COMPANY } from "../../errors/CompaniesError";
import { mongooseUpdateOptions } from "../../../utils/mongooseUpdateOptions";
import { isMongoId } from "class-validator";
import { CompanyQueryParams } from "../../models/companies/CompanyQueryParams";
import { getModelSafeData } from "../../../utils/getModelSafeData";
import { getSafeFindQueryConditions } from "../../../utils/getSafeFindQueryConditions";

@Service()
export class CompaniesService {
    private Company: MongooseModel<Company>;

    constructor() {
        this.Company = CompanyModel as MongooseModel<Company>;
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

    async addCompany(company: Company): Promise<Company> {
        const model = new this.Company(sanitizeModelBody<Company>(company));
        return await model.save();
    }

    async updateCompany(companyId: string, companyPartial: Partial<Company>): Promise<Company> {
        if (!isMongoId(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        return await this.Company.findByIdAndUpdate(
            companyId,
            sanitizeModelBody(companyPartial),
            mongooseUpdateOptions
        ).exec();
    }

    async removeCompany(companyId: string): Promise<Company> {
        if (!isMongoId(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const company = await this.Company.findById(companyId);
        if (!company) {
            throw new BadRequest(ERROR_NO_COMPANY);
        }
        // @TODO: Mark all projects and project sections as inactive or delete them.
        return await this.Company.findByIdAndDelete(companyId).exec();
    }
}
