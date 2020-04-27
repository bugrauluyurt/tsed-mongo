import { firstLetterToggleCase } from "./default";
import { LetterCase } from "../src/enums/letterCase";

export const getFieldNameFromClassName = (className: string): string => {
    return firstLetterToggleCase(className, LetterCase.LOWER);
};
