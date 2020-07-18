import * as _ from "lodash";

const forbiddenQueryParams = ["id", "_id"];
export const getModelSafeQueryParams = <T>(model: T, queryParams = {}): Partial<T> => {
    if (!model || _.isEmpty(queryParams)) {
        return {};
    }
    return _.reduce(
        Object.keys(queryParams),
        (acc, queryParam) => {
            if (!Object.hasOwnProperty.call(model, queryParam) || _.includes(forbiddenQueryParams, queryParam)) {
                return acc;
            }
            return { ...acc, [queryParam]: queryParams[queryParam] };
        },
        {}
    );
};
