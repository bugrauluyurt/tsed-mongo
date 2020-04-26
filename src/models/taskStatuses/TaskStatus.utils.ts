export namespace TaskStatusUtils {
    export const COLLECTION_NAME = "TaskStatuses";
    export const MODEL_NAME = "TaskStatus";

    export enum STATUS {
        WORKING = "working",
        STUCK = "stuck",
        DONE = "done",
        INTRO_CALL = "introCall",
        NEGOTIATION = "negotiation",
    }
}
