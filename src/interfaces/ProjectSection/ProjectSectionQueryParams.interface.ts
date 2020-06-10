import { ActiveStatus } from "../../enums/ActiveStatus";
import { IPaginationQueryParams } from "../PaginationQueryParams.interface";

export interface IProjectSectionQueryParams extends IPaginationQueryParams {
    active: ActiveStatus;
    projectId: string;
}
