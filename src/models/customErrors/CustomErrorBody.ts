export default class CustomErrorBody {
    constructor(private key: string, private message?: string) {}
}

export const createCustomErrorBody = (
    errorKey: string,
    errorContext: { [errorKey: string]: string }
): CustomErrorBody => {
    return new CustomErrorBody(errorKey, errorContext[errorKey]);
};
