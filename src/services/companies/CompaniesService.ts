import { Service } from "@tsed/common";
import * as _ from "lodash";
import { MongooseModel } from "../../types/MongooseModel";
import { Company, CompanyModel } from "../../models/companies/Company";
import { getSanitizedQueryParams } from "../../../utils/getSanitizedQueryParams";
import { getSanitizedPaginationParams } from "../../../utils/paginationHelper";
import * as mongoose from "mongoose";
import { ICompaniesQueryParams } from "../../interfaces/Companies/CompaniesQueryParams.interface";
import { sanitizeModelBody } from "../../../utils/sanitizeUpdateBody";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_NO_COMPANY_ID, ERROR_NO_COMPANY } from "../../errors/CompaniesError";

@Service()
export class CompaniesService {
    private Company: MongooseModel<Company>;

    constructor() {
        this.Company = CompanyModel as MongooseModel<Company>;
    }

    async findCompanies(queryParams: Partial<ICompaniesQueryParams>): Promise<Company[]> {
        const { page, pageSize } = getSanitizedPaginationParams<Partial<ICompaniesQueryParams>>(queryParams);
        const conditions = !_.isEmpty(queryParams?.companyIds)
            ? {
                  _id: {
                      $in: _.reduce(
                          queryParams?.companyIds,
                          (acc, companyId) => acc.concat([mongoose.Types.ObjectId(companyId)]),
                          []
                      ),
                  },
              }
            : {};
        const sanitizedQueryParams = getSanitizedQueryParams(queryParams);
        return await this.Company.find({ ...conditions, ...sanitizedQueryParams })
            .sort({ projectSectionName: 1 })
            .skip(page * pageSize)
            .limit(pageSize)
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
        if (_.isEmpty(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        return await this.Company.findByIdAndUpdate(companyId, sanitizeModelBody(companyPartial), {
            omitUndefined: true,
            new: true,
            runValidators: true,
        }).exec();
    }

    async removeCompany(companyId: string): Promise<Company> {
        if (_.isEmpty(companyId)) {
            throw new BadRequest(ERROR_NO_COMPANY_ID);
        }
        const company = await this.Company.findById(companyId);
        if (!company) {
            throw new BadRequest(ERROR_NO_COMPANY);
        }
        //@TODO: Mark all projects and project sections as inactive or delete them.
        return await this.Company.findByIdAndDelete(companyId).exec();
    }
}
