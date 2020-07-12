import * as _ from "lodash";
export const sanitizeModelBody = <T>(model: T & object): Partial<T> => {
    return _.omit(model, ["id", "_id"]);
};
