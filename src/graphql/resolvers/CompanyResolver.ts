import { ResolverService } from "@tsed/graphql";
import { Company } from "../../models/companies/Company";
import { CompaniesService } from "../../services/companies/CompaniesService";
import { Query, Arg, ArgsType, Field, Args, ID, Int, Mutation, InputType } from "type-graphql";
import { ActiveStatus } from "../../enums/ActiveStatus";
import { CompanyQueryParams } from "../../models/companies/CompanyQueryParams";
import { PageSizes } from "../../enums/PageSizes";
import { MinLength, MaxLength } from "class-validator";
import { CompanyUtils } from "../../models/companies/Company.utils";
import {
    ERROR_COMPANY_DOMAIN_NAME_MIN_LENGTH,
    ERROR_COMPANY_DOMAIN_NAME_MAX_LENGTH,
} from "../../errors/CompaniesError";

// ArgsTypes
@ArgsType()
class GetCompaniesArgs implements Partial<CompanyQueryParams> {
    @Field(() => ID, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: true })
    companyName?: string;

    @Field(() => String, { nullable: true })
    domain?: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active: ActiveStatus;

    @Field(() => String, { nullable: true })
    companyIds?: string;

    @Field(() => Int, { defaultValue: 0 })
    page: number;

    @Field(() => PageSizes, { defaultValue: PageSizes.TWENTY })
    pageSize: PageSizes;
}

// InputTypes
@InputType({ description: "Add Company data" })
class AddCompanyInput implements Partial<Company> {
    @Field()
    companyName: string;

    @Field(() => String, { nullable: true })
    @MaxLength(CompanyUtils.MAX_DOMAIN_NAME, {
        message: ERROR_COMPANY_DOMAIN_NAME_MAX_LENGTH,
    })
    @MinLength(CompanyUtils.MIN_DOMAIN_NAME, {
        message: ERROR_COMPANY_DOMAIN_NAME_MIN_LENGTH,
    })
    domain: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active: ActiveStatus;
}

@InputType({ description: "Update Company data" })
class PatchCompanyInput extends AddCompanyInput {
    @Field(() => ID)
    _id: string;

    @Field(() => String, { nullable: true })
    companyName: string;
}

@ResolverService(Company)
export class CompanyResolver {
    constructor(private companiesService: CompaniesService) {}

    @Query(() => [Company])
    async companies(@Args() getCompaniesArgs: GetCompaniesArgs): Promise<Company[]> {
        return await this.companiesService.findCompanies(getCompaniesArgs);
    }

    @Query(() => Company)
    async company(@Arg("_id") id: string): Promise<Company> {
        return await this.companiesService.findCompanyById(id);
    }

    // Mutations
    @Mutation(() => Company)
    async addCompany(@Arg("data") company: AddCompanyInput): Promise<Company | Error> {
        return await this.companiesService.addCompany(company);
    }

    @Mutation(() => Company)
    async updateCompany(@Arg("data") company: PatchCompanyInput): Promise<Company> {
        return await this.companiesService.patchCompany(company._id, company);
    }

    @Mutation(() => Company)
    async removeCompany(@Arg("_id") id: string): Promise<Company> {
        return await this.companiesService.removeCompany(id);
    }
}
