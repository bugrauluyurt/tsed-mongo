import * as _ from "lodash";

export const removePollutingKeys = (params: object): object => {
    if (_.isEmpty(params) || !_.isObject(params)) {
        return {};
    }
    return _.reduce(
        Object.keys(params),
        (acc, paramKey) => {
            if (acc[paramKey]) {
                delete params[paramKey];
                return acc;
            }
            let paramValue = params[paramKey];
            if (_.isArray(paramValue)) {
                paramValue = _.get(paramValue, "0");
            }
            return { ...acc, [paramKey]: paramValue };
        },
        {}
    );
};
