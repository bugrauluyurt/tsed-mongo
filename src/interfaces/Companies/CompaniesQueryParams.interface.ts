import { Company } from "../../models/companies/Company";
import { IPaginationQueryParams } from "../PaginationQueryParams.interface";
import { ActiveStatus } from "../../enums/ActiveStatus";

export interface ICompaniesQueryParams extends Company, IPaginationQueryParams {
    active: ActiveStatus;
    companyIds?: string[];
}
