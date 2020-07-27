import * as _ from "lodash";
import { serializeObject, serializeArray } from "../utils/serializeData";

class MiddlewareFactory {
    private middlewareStore: { [key: string]: Function } = {};
    create(CustomMiddleware: Function, metaData?: any): Function {
        let md = metaData || "default";
        if (_.isArray(md)) {
            md = serializeArray(md);
        }
        if (_.isObject(md)) {
            md = serializeObject(md);
        }
        // eslint-disable-next-line prettier/prettier
        const middlewareIdentifier = `${CustomMiddleware.name}_${md}`;
        if (!this.middlewareStore[middlewareIdentifier]) {
            this.middlewareStore[middlewareIdentifier] = CustomMiddleware(metaData);
        }
        // eslint-disable-next-line prettier/prettier
        return this.middlewareStore[middlewareIdentifier];
    }
}

const factory = new MiddlewareFactory();
export default factory;
