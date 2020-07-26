import { IPaginationQueryParams } from "./PaginationQueryParams.interface";

export interface ModelSafeData<T> {
    modelSafeData: T | Partial<T>;
    otherData: {} & IPaginationQueryParams;
}
