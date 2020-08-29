import { registerEnumType } from "type-graphql";

export enum PageSizes {
    FIVE = 5,
    TEN = 10,
    TWENTY = 20,
    FIFTY = 50,
    HUNDRED = 100,
}

registerEnumType(PageSizes, {
    name: "PageSizes",
});
