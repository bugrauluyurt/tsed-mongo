import * as _ from "lodash";
import { PageSizes } from "../enums/PageSizes";
import { ModelSafeData } from "../interfaces/ModelSafeData.interface";

const forbiddenQueryParams = ["id", "_id", "page", "pageSize"];
export const getModelSafeData = <T>(dirtyData = {}, modelInstance: T, omittedKeys: string[] = []): ModelSafeData<T> => {
    if (!modelInstance || _.isEmpty(dirtyData)) {
        return { modelSafeData: {}, otherData: {} } as ModelSafeData<T>;
    }
    const toBeDeletedKeys = forbiddenQueryParams.concat(omittedKeys);
    const modelSafeData = _.reduce(
        Object.keys(dirtyData),
        (acc, dirtyDataKey) => {
            if (
                !_.includes(Object.keys(modelInstance), dirtyDataKey) ||
                !dirtyData[dirtyDataKey] ||
                dirtyData[dirtyDataKey] === "undefined" ||
                _.includes(toBeDeletedKeys, dirtyDataKey) ||
                /^\$/.test(dirtyDataKey)
            ) {
                return acc;
            }
            return { ...acc, [dirtyDataKey]: dirtyData[dirtyDataKey] };
        },
        {}
    );
    const response = { modelSafeData, otherData: {} } as ModelSafeData<T>;
    if (dirtyData["pageSize"]) {
        let pageSize = Math.round(_.get(dirtyData, "pageSize", PageSizes.TWENTY));
        if (pageSize > PageSizes.HUNDRED) {
            pageSize = PageSizes.HUNDRED;
        }
        response.otherData["pageSize"] = pageSize;
    }
    if (dirtyData["page"]) {
        response.otherData["page"] = Math.round(_.get(dirtyData, "page", 0));
    }
    return response;
};
