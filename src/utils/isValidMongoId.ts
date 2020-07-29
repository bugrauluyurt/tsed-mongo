import validator from "validator";
import * as _ from "lodash";

export const isValidMongoId = (id: any): boolean => {
    return _.isString(id) && validator.isMongoId(id);
};
