export namespace TaskStatusUtils {
    export const COLLECTION_NAME: string = "TaskStatuses";
    export const MODEL_NAME: string = "TaskStatus";

    export enum STATUS {
        WORKING = "working",
        STUCK = "stuck",
        DONE = "done",
        INTRO_CALL = "introCall",
        NEGOTIATION = "negotiation",
    }
}
