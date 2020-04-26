import { UseBefore } from "@tsed/common";
import { RequiredQueryParamsMiddleware } from "../middlewares/requiredQueryParams/RequiredQueryParamsMiddleware";
import MiddlewareFactory from "../middlewares/MiddlewareFactory";

export function UseRequiredQueryParams(requiredQueryParams: string[]): Function {
    return (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> => {
        // Wrap the UseBefore decorator to push the middleware before the endpoint execution
        return UseBefore(MiddlewareFactory.create(RequiredQueryParamsMiddleware, requiredQueryParams))(
            target,
            targetKey,
            descriptor
        );
    };
}
