import * as chalk from "chalk";
import * as moment from "moment";
import { Chalk } from "chalk";

export const firstLetterUpperCase = (str: string): string => {
    const firstLetter = str.substring(0, 1).toUpperCase();
    const remainingLetters = str.substring(1, str.length);
    return `${firstLetter}${remainingLetters}`;
};

export const logWithColor = (key, value, shouldStringify: boolean = true, color: Chalk = chalk.green): void => {
    const colorBold = chalk.bold;
    const timeStamp = moment().format("YYYY-MM-DDTHH:MM:SS.SSS");

    const keyLogMessage = colorBold(firstLetterUpperCase(key));
    const valueLogMessage = shouldStringify ? JSON.stringify(value) : value;

    const defaultLogMessage = color(`[${timeStamp}] [INFO ] [ULOG] -`);
    console.log(`${defaultLogMessage} ${keyLogMessage} ${valueLogMessage}`);
};
