import * as chalk from "chalk";
import * as moment from "moment";
import { Chalk } from "chalk";

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

const LOG_BLACK_LIST = ["secret"];

export const firstLetterUpperCase = (str: string): string => {
    const firstLetter = str.substring(0, 1).toUpperCase();
    const remainingLetters = str.substring(1, str.length);
    return `${firstLetter}${remainingLetters}`;
};

export const logObject = (obj: object, fixCyclicReferences: boolean = false): void => {
    Object.keys(obj).forEach((settingKey: string) => {
        let settingValue = obj[settingKey];
        if (settingValue instanceof Object && fixCyclicReferences) {
            settingValue = JSON.stringify(settingValue, getCircularReplacer());
        }
        if (settingValue.length > 1000) {
            settingValue = "[Long string]";
        }
        if (LOG_BLACK_LIST.indexOf(settingValue.toString().toLowerCase()) !== -1) {
            return;
        }
        logWithColor(settingKey, settingValue);
    });
};

export const logWithColor = (key, value, shouldStringify: boolean = true, color: Chalk = chalk.green): void => {
    const colorBold = chalk.bold;
    const timeStamp = moment().format("YYYY-MM-DDTHH:MM:SS.SSS");

    const keyLogMessage = colorBold(firstLetterUpperCase(key));
    const valueLogMessage = shouldStringify ? JSON.stringify(value) : value;

    const defaultLogMessage = color(`[${timeStamp}] [INFO ] [ULOG] -`);
    console.log(`${defaultLogMessage} ${keyLogMessage} ${valueLogMessage}`);
};
