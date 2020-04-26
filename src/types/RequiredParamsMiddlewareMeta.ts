export interface RequiredParamsMiddlewareMeta {
    type: "path" | "query";
    requiredParams: string[];
}
