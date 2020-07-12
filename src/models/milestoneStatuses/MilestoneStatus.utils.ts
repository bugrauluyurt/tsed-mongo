export namespace MilestoneStatusUtils {
    export const COLLECTION_NAME = "MilestoneStatuses";
    export const MODEL_NAME = "MilestoneStatus";

    export enum STATUS {
        READY = "ready",
        WORKING = "working",
        STUCK = "stuck",
        DONE = "done",
        INTRO_CALL = "introCall",
        NEGOTIATION = "negotiation",
    }
}
