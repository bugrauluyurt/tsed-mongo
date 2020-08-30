import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { Enum, Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSection";
import * as mongoose from "mongoose";
import { HookNextFunction } from "mongoose";
import { getForeignKeyValidator } from "../../utils/foreignKeyHelper";
import { ProjectSectionsUtils } from "../projectSections/ProjectSection.utils";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import * as _ from "lodash";
import {
    ERROR_DATE_ORDER,
    ERROR_MILESTONE_WEIGHT_MIN,
    ERROR_MILESTONE_WEIGHT_MAX,
    ERROR_MILESTONE_BODY_MIN_LENGTH,
    ERROR_MILESTONE_BODY_MAX_LENGTH,
} from "../../errors/MilestonesError";
import { MilestoneUtils } from "./Milestone.utils";
import { MilestoneStatus, MilestoneStatusModel } from "../milestoneStatuses/MilestoneStatus";
import { MilestoneTags } from "../../enums/MilestoneTags";
import { Priority } from "../../enums/Priority";
import {
    ERROR_MILESTONE_NAME_MIN_LENGTH,
    ERROR_MILESTONE_NAME_MAX_LENGTH,
    ERROR_MILESTONE_NAME_MISSING,
} from "../../errors/MilestonesError";
import { ERROR_MILESTONE_STATUS_NAME_MISSING } from "../../errors/MilestoneStatusError";
import { MilestoneStatusUtils } from "../milestoneStatuses/MilestoneStatus.utils";
import { ObjectType, Field, ID, Int, InputType } from "type-graphql";
import { Max, Min, MinLength, MaxLength } from "class-validator";

@MongooseSchema()
@ObjectType()
export class Milestone {
    @ObjectID("id")
    @Field(() => ID)
    _id: string;

    @Property()
    @Required()
    @Ref(ProjectSection)
    @Indexed()
    @Field(() => String)
    @Description("Reference to projectSection where this milestone belongs to.")
    projectSection: Ref<ProjectSection> = null;

    @Required()
    @MinLength(MilestoneUtils.MILESTONE_NAME_MIN_LENGTH)
    @MaxLength(MilestoneUtils.MILESTONE_NAME_MAX_LENGTH)
    @Field(() => String)
    @Description("Name of the milestone.")
    milestoneName: string = null;

    @MinLength(MilestoneUtils.MILESTONE_BODY_MIN_LENGTH)
    @MaxLength(MilestoneUtils.MILESTONE_BODY_MAX_LENGTH)
    @Field(() => String, { nullable: true })
    @Description("Body of the milestone.")
    milestoneBody: string = null;

    @Field(() => Date, { nullable: true })
    @Description("Start date of the milestone.")
    startDate: Date = null;

    @Field(() => Date, { nullable: true })
    @Description("End date of the milestone.")
    endDate: Date = null;

    @Ref(MilestoneStatus)
    @Field(() => String, { nullable: true })
    @Description("Status of the milestone.")
    status: Ref<MilestoneStatus> = null;

    @Field(() => [MilestoneTags], { defaultValue: [MilestoneTags.GENERIC] })
    @Description("Custom tags that user can enter to filter the milestones.")
    tags: MilestoneTags[] = [MilestoneTags.GENERIC];

    @Enum(Priority)
    @Field(() => Priority, { defaultValue: Priority.MEDIUM })
    @Description("Priority of a milestone. Supported priorities are Low | Medium | High.")
    priority: Priority = Priority.MEDIUM;

    @Description("Sequence of a milestone. Sent by the client so that milestones can be sorted by sequence if desired.")
    @Field(() => Int, { defaultValue: 0 })
    sequence = 0;

    @Description(
        "Weight of a milestone. Sent by the client so that milestones value for the contract can be calculated."
    )
    @Field(() => Int, { defaultValue: 1 })
    @Min(MilestoneUtils.MILESTONE_WEIGHT_MIN)
    @Max(MilestoneUtils.MILESTONE_WEIGHT_MAX)
    weight = 1;
}

// Schema Definition
export const MilestoneSchemaDefinition = {
    projectSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ProjectSectionsUtils.MODEL_NAME,
        validate: getForeignKeyValidator.call(this, ProjectSectionsUtils.MODEL_NAME, ERROR_PROJECT_SECTION_MISSING),
        required: [true, ERROR_PROJECT_SECTION_MISSING],
        index: true,
    },
    milestoneName: {
        type: String,
        required: [true, ERROR_MILESTONE_NAME_MISSING],
        minLength: [MilestoneUtils.MILESTONE_NAME_MIN_LENGTH, ERROR_MILESTONE_NAME_MIN_LENGTH],
        maxLength: [MilestoneUtils.MILESTONE_NAME_MAX_LENGTH, ERROR_MILESTONE_NAME_MAX_LENGTH],
    },
    milestoneBody: {
        type: String,
        minLength: [MilestoneUtils.MILESTONE_BODY_MIN_LENGTH, ERROR_MILESTONE_BODY_MIN_LENGTH],
        maxLength: [MilestoneUtils.MILESTONE_BODY_MAX_LENGTH, ERROR_MILESTONE_BODY_MAX_LENGTH],
    },
    startDate: {
        type: Date,
        required: function (): boolean {
            return !_.isEmpty(this.endDate);
        },
        validate: {
            validator: function (startDate: Date): boolean {
                if (!this.endDate) return false;
                return this.endDate > startDate;
            },
            message: ERROR_DATE_ORDER,
        },
    },
    endDate: {
        type: Date,
        required: function (): boolean {
            return !_.isEmpty(this.startDate);
        },
        validate: {
            validator: function (endDate: Date): boolean {
                if (!this.startDate) return false;
                return endDate > this.startDate;
            },
            message: ERROR_DATE_ORDER,
        },
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MilestoneStatusUtils.MODEL_NAME,
        validate: getForeignKeyValidator.call(
            this,
            MilestoneStatusUtils.MODEL_NAME,
            ERROR_MILESTONE_STATUS_NAME_MISSING
        ),
    },
    tags: {
        type: [String],
        default: [MilestoneTags.GENERIC],
    },
    priority: {
        type: String,
        enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH],
    },
    sequence: {
        type: Number,
        default: 0,
    },
    weight: {
        type: Number,
        default: MilestoneUtils.MILESTONE_WEIGHT_MAX,
        min: [MilestoneUtils.MILESTONE_WEIGHT_MIN, ERROR_MILESTONE_WEIGHT_MIN],
        max: [MilestoneUtils.MILESTONE_WEIGHT_MAX, ERROR_MILESTONE_WEIGHT_MAX],
    },
};

export const MilestoneSchema = new mongoose.Schema(MilestoneSchemaDefinition, { versionKey: false });

// Hooks
MilestoneSchema.pre<Milestone & mongoose.Document>("save", async function (next: HookNextFunction) {
    if (!this.status) {
        const milestoneStatus = await MilestoneStatusModel.findOne({ name: MilestoneStatusUtils.STATUS.READY });
        this.status = milestoneStatus._id;
    }
    if (!this.tags) {
        this.tags = [];
    }
    if (!_.includes(this.tags, MilestoneTags.GENERIC)) {
        this.tags = [MilestoneTags.GENERIC, ...this.tags];
    }
    next();
});

export const MilestoneModel = mongoose.model<Milestone & mongoose.Document>(MilestoneUtils.MODEL_NAME, MilestoneSchema);
