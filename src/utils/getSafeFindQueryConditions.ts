import * as _ from "lodash";
import * as mongoose from "mongoose";
import { isValidMongoId } from "./isValidMongoId";

// Ex: [["_id", "milestoneIds"]]
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
                          if (!isValidMongoId(id)) {
                              return acc;
                          }
                          return acc.concat([mongoose.Types.ObjectId(id)]);
                      },
                      []
                  ),
              },
          }
        : {};
    return {
        ...generatedConditions,
        ..._.omit(conditions, [conditionsKey]),
    };
};
