import * as _ from "lodash";
import { logWithColor } from "../../utils/default";
import chalk = require("chalk");

const generateRandomIndex = (length: number) => {
    return _.random(0, length - 1);
};

export const getRandomUniqueSeedItems = (
    collection: any[] = [],
    returnedItemCount: number = 1,
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
        const randomItem = collection[generateRandomIndex(collectionLength)];
        if (!randomItemMap[randomItem._id]) {
            randomItemMap[randomItem._id] = true;
            return randomItem;
        }
        return getRandomUniqueItem();
    };

    let requestedItemCount = returnedItemCount;
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
