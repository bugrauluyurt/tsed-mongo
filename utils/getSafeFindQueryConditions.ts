import * as _ from "lodash";
import { isMongoId } from "class-validator";
import * as mongoose from "mongoose";

// Ex: [["_id", "milestoneIds"], ["projectSectionName"]]
export const getSafeFindQueryConditions = <T>(
    conditions: T | any = {},
    objectIdsIdentifiers: Array<string[]>
): Partial<T> => {
    if (_.isEmpty(objectIdsIdentifiers)) {
        return conditions;
    }
    const queryIdentifier = _.get(objectIdsIdentifiers, "0.0");
    const conditionsKey = _.get(objectIdsIdentifiers, "0.1", queryIdentifier);
    const generatedConditions = !_.isEmpty(conditions[conditionsKey])
        ? {
              [queryIdentifier]: {
                  $in: _.reduce(
                      _.split(conditions[conditionsKey], ","),
                      (acc, id) => {
                          if (!isMongoId(id)) {
                              return acc;
                          }
                          return acc.concat([mongoose.Types.ObjectId(id)]);
                      },
                      []
                  ),
              },
          }
        : {};
    const returnValue = {
        ...generatedConditions,
        ..._.omit(conditions, [conditionsKey]),
    } as Partial<T>;
    if (_.size(objectIdsIdentifiers) === 1) {
        return returnValue;
    }
    return getSafeFindQueryConditions(conditions, _.slice(objectIdsIdentifiers, 1));
};
