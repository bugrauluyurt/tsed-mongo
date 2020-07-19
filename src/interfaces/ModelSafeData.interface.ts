import { IPaginationQueryParams } from "./PaginationQueryParams.interface";

export interface ModelSafeData<T> {
    modelSafeData: Partial<T>;
    otherData: {} & IPaginationQueryParams;
}
