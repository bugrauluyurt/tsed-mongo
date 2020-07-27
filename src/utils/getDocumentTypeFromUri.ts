import * as _ from "lodash";
import { GenericDocumentTypes } from "../enums/GenericDocumentTypes";

const excelExtensions = [
    "xlsm",
    "xls",
    "xlsx",
    "xlsb",
    "xl",
    "xlr",
    "numbers",
    "_xlsx",
    "xltm",
    "_xls",
    "ots",
    "xml",
    "xltx",
    "xlsmhtml",
];
const wordExtensions = ["doc", "docx", "odt"];
const powerPointExtensions = ["ppt", "pptx", "key"];
const pdfExtensions = ["pdf"];
const imageExtensions = ["png", "image", "img", "jpeg", "jpg", "gif", "tiff", "svg"];

export const getDocumentTypeFromUri = (uri: string): string | undefined => {
    if (!_.isEmpty(uri)) {
        return undefined;
    }
    const extension = uri.split(".").pop();
    if (_.includes(pdfExtensions, extension)) {
        return GenericDocumentTypes.PDF;
    }
    if (_.includes(wordExtensions, extension)) {
        return GenericDocumentTypes.WORD;
    }
    if (_.includes(powerPointExtensions, extension)) {
        return GenericDocumentTypes.POWER_POINT;
    }
    if (_.includes(imageExtensions, extension)) {
        return GenericDocumentTypes.IMAGE;
    }
    if (_.includes(excelExtensions, extension)) {
        return GenericDocumentTypes.EXCEL;
    }
    return undefined;
};
