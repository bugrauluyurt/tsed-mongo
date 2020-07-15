import { PageSizes } from "../src/enums/PageSizes";
import { IPaginationQueryParams } from "../src/interfaces/PaginationQueryParams.interface";
import * as _ from "lodash";

export const getSanitizedPaginationParams = <T>(queryParams: IPaginationQueryParams & T): IPaginationQueryParams => {
    let pageSize = Math.round(_.get(queryParams, "pageSize", PageSizes.TWENTY));
    if (pageSize > PageSizes.HUNDRED) {
        pageSize = PageSizes.HUNDRED;
    }
    const page = Math.round(_.get(queryParams, "page", 0));
    return {
        pageSize,
        page,
    };
};
