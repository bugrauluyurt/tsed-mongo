import { Company } from "./Company";
import { IPaginationQueryParams } from "../../interfaces/PaginationQueryParams.interface";
import { ActiveStatus } from "../../enums/ActiveStatus";
import { PageSizes } from "../../enums/PageSizes";

export class CompanyQueryParams extends Company implements IPaginationQueryParams {
    active: ActiveStatus = ActiveStatus.ACTIVE;
    companyIds: string = null;
    page = 0;
    pageSize = PageSizes.TWENTY;
}
