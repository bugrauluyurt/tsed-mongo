import * as _ from "lodash";
import { logWithColor } from "../../utils/default";
import chalk = require("chalk");
import * as bcrypt from "bcrypt";

export const DEFAULT_PASSWORD = "12345";
export const ADMIN_USER_NAME = "admin";
export const ADMIN_PASSWORD = "admin";

export const createAdminPassword = () => {
    return bcrypt.hash(ADMIN_PASSWORD, 10);
};

export const createDefaultPassword = () => {
    return bcrypt.hash(DEFAULT_PASSWORD, 10);
};

const generateRandomIndexFromListSize = (listSize: number) => {
    return _.random(0, listSize - 1);
};

export const noop = () => {};

export const getRandomUniqueSeedItems = (
    collection: any[] = [],
    // Given is the number of items to be returned.
    returnedItemCount: number = 1,
    // If changeReturnedItemCountEachIteration=true, then function randomly changes the returnedItemCount for each iteration taking the given argument value as max.
    changeReturnedItemCountEachIteration: boolean = false,
    collectionName?: string,
): any[] => {
    const collectionLength = collection.length;
    if (!collectionLength) {
        return [];
    }
    let errorTriggered = false;
    const randomItemMap: { [key: string]: any } = {};

    const getRandomUniqueItem = (): any | undefined => {
        if (_.keys(randomItemMap).length >= collectionLength) {
            if (!errorTriggered) {
                logWithColor(`[ERROR] [${collectionName || "NO_COLLECTION_NAME"}]`, "Unique items can not be generated. Please either lower returned item count or increase the source collection size", false, chalk.red);
                errorTriggered = true;
            }
            return undefined;
        }
        const randomItem = collection[generateRandomIndexFromListSize(collectionLength)];
        if (!randomItemMap[randomItem._id]) {
            randomItemMap[randomItem._id] = true;
            return randomItem;
        }
        return getRandomUniqueItem();
    };

    let requestedItemCount = returnedItemCount;
    if (changeReturnedItemCountEachIteration) {
        const countRange = _.range(0, returnedItemCount);
        requestedItemCount = countRange[generateRandomIndexFromListSize(countRange.length)];
    }
    const returnArr = [];
    while (requestedItemCount) {
        const randomUniqueItem = getRandomUniqueItem();
        if (randomUniqueItem) {
            returnArr.push(randomUniqueItem);
        }
        requestedItemCount--;
    }
    return returnArr;
};
