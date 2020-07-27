import * as _ from "lodash";

export const getSanitizedQueryParams = (params: object): object => {
    if (_.isEmpty(params) || !_.isObject(params)) {
        return {};
    }
    return _.reduce(
        Object.keys(params),
        (acc, paramKey) => {
            let paramValue = params[paramKey];
            if (
                paramKey === "undefined" || // Param key is string undefined
                paramValue === "undefined" || // Param value is string undefined
                acc[paramKey] || // Duplicate params
                !paramValue || // Param value is undefined
                /^\$/.test(paramKey)
            ) {
                delete params[paramKey];
                return acc;
            }
            if (_.isArray(paramValue)) {
                paramValue = _.get(paramValue, "0");
            }
            return { ...acc, [paramKey]: paramValue };
        },
        {}
    );
};
