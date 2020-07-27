import * as _ from "lodash";
import { ActiveStatus } from "../enums/ActiveStatus";

export const preSaveActiveStatus = (model: any): void => {
    if (_.isUndefined(model.active)) {
        model.active = ActiveStatus.ACTIVE;
    }
};
