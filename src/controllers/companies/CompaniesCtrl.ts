import {
    Controller,
    Get,
    UseAuth,
    Status,
    QueryParams,
    Req,
    PathParams,
    Required,
    Patch,
    Post,
    Delete,
    BodyParams,
} from "@tsed/common";
import { Summary } from "@tsed/swagger";
import { UserRole, UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { CompaniesService } from "../../services/companies/CompaniesService";
import { Company } from "../../models/companies/Company";
import { CompanyQueryParams } from "../../models/companies/CompanyQueryParams";

@Controller("/company")
export class CompaniesCtrl {
    constructor(private companiesService: CompaniesService) {}

    @Get("/")
    @Summary("Returns companies")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Array,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getCompanies(@QueryParams() queryParams: Partial<CompanyQueryParams>): Promise<Company[]> {
        return this.companiesService.findCompanies(queryParams);
    }

    @Post("/add")
    @Summary("Adds a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async addCompany(req: Req): Promise<Company | Error> {
        return this.companiesService.addCompany(req.body as Company);
    }

    @Get("/:companyId")
    @Summary("Returns a company by id")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async getCompanyById(@Required() @PathParams("companyId") companyId: string): Promise<Company> {
        return this.companiesService.findCompanyById(companyId);
    }

    @Patch("/:companyId")
    @Summary("Updates a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async updateCompany(
        @Required() @PathParams("companyId") companyId: string,
        @BodyParams() reqBody
    ): Promise<Company> {
        return this.companiesService.updateCompany(companyId, reqBody as Company);
    }

    @Delete("/:companyId")
    @Summary("Deletes a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: UserRolesAll })
    async removeCompany(@Required() @PathParams("companyId") companyId: string): Promise<Company> {
        return this.companiesService.removeCompany(companyId);
    }
}
