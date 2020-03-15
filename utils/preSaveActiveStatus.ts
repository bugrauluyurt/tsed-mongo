import * as _ from "lodash";

export const preSaveActiveStatus = (model: any): void => {
    if (_.isUndefined(model.active)) {
        model.active = false;
    }
};
