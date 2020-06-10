import { PageSizes } from "../src/enums/PageSizes";
import { IPaginationQueryParams } from "../src/interfaces/PaginationQueryParams.interface";
import * as _ from "lodash";

export const getSanitizedPaginationParams = (
    queryParams: IPaginationQueryParams & { [key: string]: any }
): IPaginationQueryParams => {
    const pageSize = Math.round(_.get(queryParams, "pageSize", PageSizes.TWENTY));
    const page = Math.round(_.get(queryParams, "page", 0));
    return {
        pageSize,
        page,
    };
};
