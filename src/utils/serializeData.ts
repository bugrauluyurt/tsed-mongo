import * as _ from "lodash";

export const serializeArray = (data: any[]): string | void => {
    return _.join(data, "_");
};

export const serializeObject = (data: object): string => {
    return _.reduce(
        Object.keys(data),
        (acc, metaKey) => {
            let metaValue = data[metaKey];
            if (_.isArray(metaValue)) {
                metaValue = serializeArray(metaValue);
            }
            return `${acc}_${metaValue}_${metaKey}`;
        },
        ""
    );
};
