import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { Enum, MaxLength, MinLength, Property, Required, Minimum, Maximum } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSection";
import * as mongoose from "mongoose";
import { HookNextFunction } from "mongoose";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectSectionsUtils } from "../projectSections/ProjectSection.utils";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import * as _ from "lodash";
import { ERROR_DATE_ORDER, ERROR_MILESTONE_WEIGHT_MIN, ERROR_MILESTONE_WEIGHT_MAX } from "../../errors/MilestonesError";
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
import { CompanySchemaDefinition } from "../companies/Company";

@MongooseSchema()
export class Milestone {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    @Ref(ProjectSection)
    @Indexed()
    @Description("Reference to projectSection where this milestone belongs to.")
    projectSection: Ref<ProjectSection>;

    @Required()
    @MinLength(MilestoneUtils.MILESTONE_NAME_MIN_LENGTH)
    @MaxLength(MilestoneUtils.MILESTONE_NAME_MAX_LENGTH)
    @Description("Name of the milestone.")
    milestoneName: string;

    @Required()
    @MinLength(MilestoneUtils.MILESTONE_BODY_MIN_LENGTH)
    @MaxLength(MilestoneUtils.MILESTONE_BODY_MAX_LENGTH)
    @Description("Body of the milestone.")
    milestoneBody: string;

    @Description("Start date of the milestone.")
    startDate: Date;

    @Description("End date of the milestone.")
    endDate: Date;

    @Ref(MilestoneStatus)
    @Description("Status of the milestone.")
    status: Ref<MilestoneStatus>;

    @Description("Custom tags that user can enter to filter the milestones.")
    tags: string[] = [MilestoneTags.DEFAULT];

    @Enum(Priority)
    @Description("Priority of a milestone. Supported priorities are Low | Medium | High.")
    priority: Priority;

    @Description("Sequence of a milestone. Sent by the client so that milestones can be sorted by sequence if desired.")
    sequence = 0;

    @Description(
        "Weight of a milestone. Sent by the client so that milestones value for the contract can be calculated."
    )
    @Minimum(MilestoneUtils.MILESTONE_WEIGHT_MIN)
    @Maximum(MilestoneUtils.MILESTONE_WEIGHT_MAX)
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
        default: [MilestoneTags.DEFAULT],
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
    if (!_.includes(this.tags, MilestoneTags.DEFAULT)) {
        this.tags = [MilestoneTags.DEFAULT, ...this.tags];
    }
    next();
});

export const MilestoneModel = mongoose.model<Milestone & mongoose.Document>(MilestoneUtils.MODEL_NAME, MilestoneSchema);
