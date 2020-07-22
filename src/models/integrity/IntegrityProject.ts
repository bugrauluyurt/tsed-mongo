import { Required } from "@tsed/common";
import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Description } from "@tsed/swagger";
import { Schema, HookNextFunction } from "mongoose";
import * as mongoose from "mongoose";
import { ERROR_NO_PROJECT_ID } from "../../errors/ProjectsError";
import { IntegrityUtils } from "./Integrity.utils";
import { ERROR_NO_DATE } from "../../errors/DateError";

@MongooseSchema()
export class IntegrityProject {
    @ObjectID("id")
    _id: string;

    @Required()
    @Description(
        "Project id to be deleted on next cron job. If project with the id is already deleted, projectSection under that project are going to be deleted"
    )
    @ObjectID("id")
    projectId: string;

    @Description("Storage date")
    date: Date = new Date();
}

// Schema Definition
export const IntegrityProjectSchemaDefinition = {
    projectId: {
        type: Schema.Types.ObjectId,
        required: [true, ERROR_NO_PROJECT_ID],
    },
    date: {
        type: Date,
        required: [true, ERROR_NO_DATE],
    },
};

export const IntegrityProjectSchema = new Schema(IntegrityProjectSchemaDefinition, { versionKey: false });
// Hooks
IntegrityProjectSchema.pre<IntegrityProject & mongoose.Document>("save", async function (next: HookNextFunction) {
    if (!this.date || !(this.date instanceof Date)) {
        this.date = new Date();
    }
    next();
});

export const IntegrityProjectModel = mongoose.model<IntegrityProject & mongoose.Document>(
    IntegrityUtils.MODEL_NAME_PROJECT,
    IntegrityProjectSchema
);
