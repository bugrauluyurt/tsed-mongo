import { IgnoreProperty, Property } from "@tsed/common";
import * as _ from "lodash";

export default class CustomError {
    @Property()
    status: number;

    @Property()
    type: string;

    @Property()
    key: string;

    @Property()
    message?: string;

    @IgnoreProperty()
    stack?: string;

    @IgnoreProperty()
    origin?: unknown;

    constructor(err: Partial<CustomError>) {
        _.keys(err).forEach((key) => (this[key] = err[key]));
    }
}
