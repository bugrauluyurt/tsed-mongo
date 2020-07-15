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
} from "@tsed/common";
import { Summary } from "@tsed/swagger";
import { UserRole, UserRolesAll } from "../../models/users/UserRole";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { CompaniesService } from "../../services/companies/CompaniesService";
import { Company } from "../../models/companies/Company";
import { ICompaniesQueryParams } from "../../interfaces/Companies/CompaniesQueryParams.interface";

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
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.SERVER] })
    async getCompanies(@QueryParams("companyId") queryParams: Partial<ICompaniesQueryParams>): Promise<Company[]> {
        return this.companiesService.findCompanies(queryParams);
    }

    @Get("/details/:companyId")
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

    @Post("/add")
    @Summary("Adds a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.SERVER] })
    async addCompany(req: Req): Promise<Company> {
        return this.companiesService.addCompany(req.body as Company);
    }

    @Patch("/details/:companyId")
    @Summary("Updates a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.SERVER, UserRole.PROJECT_ADMIN] })
    async updateCompany(@Required() @PathParams() companyId: string, req: Req): Promise<Company> {
        return this.companiesService.updateCompany(companyId, req.body as Company);
    }

    @Delete("/remove/:companyId")
    @Summary("Deletes a company")
    @Status(200, {
        description: "Success",
        type: Company,
        collectionType: Company,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.SERVER, UserRole.PROJECT_ADMIN] })
    async removeCompany(@Required() @PathParams() companyId: string): Promise<Company> {
        return this.companiesService.removeCompany(companyId);
    }
}
