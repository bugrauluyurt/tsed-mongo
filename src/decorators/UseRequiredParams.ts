import { UseBefore } from "@tsed/common";
import MiddlewareFactory from "../middlewares/MiddlewareFactory";
import { RequiredParamsMiddlewareMeta } from "../types/RequiredParamsMiddlewareMeta";
import { RequiredParamsMiddleware } from "../middlewares/requiredParams/RequiredParamsMiddleware";

export function UseRequiredParams(meta: RequiredParamsMiddlewareMeta): Function {
    return (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> => {
        // Wrap the UseBefore decorator to push the middleware before the endpoint execution
        return UseBefore(MiddlewareFactory.create(RequiredParamsMiddleware, meta))(target, targetKey, descriptor);
    };
}
