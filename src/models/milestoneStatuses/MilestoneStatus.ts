import { MongooseSchema, ObjectID } from "@tsed/mongoose";
import { Enum, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { MilestoneStatusUtils } from "./MilestoneStatus.utils";
import * as mongoose from "mongoose";
import { ERROR_MILESTONE_STATUS_NAME_MISSING } from "../../errors/MilestoneStatusError";

@MongooseSchema()
export class MilestoneStatus {
    @ObjectID("id")
    _id: string;

    @Required()
    @Enum(MilestoneStatusUtils.STATUS)
    @Description("Status of the milestone, one of ready | working | stuck | done | introCall | negotiation")
    name: MilestoneStatusUtils.STATUS;
}

// Schema Definition
export const MilestoneStatusSchemaDefinition = {
    name: {
        type: String,
        required: [true, ERROR_MILESTONE_STATUS_NAME_MISSING],
        enum: [
            MilestoneStatusUtils.STATUS.READY,
            MilestoneStatusUtils.STATUS.DONE,
            MilestoneStatusUtils.STATUS.INTRO_CALL,
            MilestoneStatusUtils.STATUS.NEGOTIATION,
            MilestoneStatusUtils.STATUS.STUCK,
            MilestoneStatusUtils.STATUS.WORKING,
        ],
    },
};

export const MilestoneStatusSchema = new mongoose.Schema(MilestoneStatusSchemaDefinition, { versionKey: false });
export const MilestoneStatusModel = mongoose.model<MilestoneStatus & mongoose.Document>(
    MilestoneStatusUtils.MODEL_NAME,
    MilestoneStatusSchema
);
