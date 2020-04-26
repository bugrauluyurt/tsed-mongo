import * as _ from "lodash";

class MiddlewareFactory {
    private middlewareStore: { [key: string]: Function } = {};
    create(CustomMiddleware: Function, metaData?: any): Function {
        // eslint-disable-next-line prettier/prettier
        const middlewareIdentifier = `${CustomMiddleware.name}${
            !_.isEmpty(metaData) ? "_" + JSON.stringify(metaData) : ""
        }`;
        if (!this.middlewareStore[middlewareIdentifier]) {
            this.middlewareStore[middlewareIdentifier] = CustomMiddleware(metaData);
        }
        // eslint-disable-next-line prettier/prettier
        return this.middlewareStore[middlewareIdentifier];
    }
}

const factory = new MiddlewareFactory();
export default factory;
