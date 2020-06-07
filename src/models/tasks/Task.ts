import { Indexed, MongooseSchema, ObjectID, Ref } from "@tsed/mongoose";
import { Enum, MaxLength, MinLength, Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { ProjectSection } from "../projectSections/ProjectSection";
import * as mongoose from "mongoose";
import { HookNextFunction } from "mongoose";
import { getForeignKeyValidator } from "../../../utils/foreignKeyHelper";
import { ProjectSectionsUtils } from "../projectSections/ProjectSection.utils";
import { ERROR_PROJECT_SECTION_MISSING } from "../../errors/ProjectSectionsError";
import * as _ from "lodash";
import {
    ERROR_DATE_ORDER,
    ERROR_TASK_NAME_MAX_LENGTH,
    ERROR_TASK_NAME_MIN_LENGTH,
    ERROR_TASK_NAME_MISSING,
} from "../../errors/TasksError";
import { TaskUtils } from "./Task.utils";
import { TaskStatus, TaskStatusModel } from "../taskStatuses/TaskStatus";
import { TaskStatusUtils } from "../taskStatuses/TaskStatus.utils";
import { ERROR_TASK_STATUS_NAME_MISSING } from "../../errors/TaskStatusError";
import { TaskTags } from "../../enums/taskTags";
import { Score } from "../../enums/scores";
import { GenericDocumentTypes } from "../../enums/genericDocumentTypes";
import { getDocumentTypeFromUri } from "../../../utils/getDocumentTypeFromUri";
import { Priority } from "../../enums/priority";
import { ERROR_CURRENCY_MISSING } from "../../errors/CurrencyError";
import { CurrencyModel } from "../currencies/Currency";
import { NotFound } from "ts-httpexceptions";
import { Currencies } from "../../enums/currencies";

@MongooseSchema()
export class Task {
    @ObjectID("id")
    _id: string;

    @Property()
    @Required()
    @Ref(ProjectSection)
    @Indexed()
    @Description("Reference to projectSection where this task belongs to.")
    projectSection: Ref<ProjectSection>;

    @Required()
    @MinLength(TaskUtils.TASK_NAME_MIN_LENGTH)
    @MaxLength(TaskUtils.TASK_NAME_MAX_LENGTH)
    @Description("Name of the task.")
    taskName: string;

    @Description("Start date of the task.")
    startDate: Date;

    @Description("End date of the task.")
    endDate: Date;

    @Ref(TaskStatus)
    @Description("Status of the task.")
    status: Ref<TaskStatus>;

    @Description("Custom tags that user can enter to filter the tasks.")
    tags: string[] = [TaskTags.DEFAULT];

    @Enum(Score)
    @Description("Score of a task from 1 to 5. Defaults to 0.")
    score: Score = Score.NO_SCORE;

    @Description("Url of the affiliated document to this task.")
    documentUrl: string;

    @Enum(TaskStatusUtils.STATUS)
    @Description(
        "Type of the attached document. Supported document types are Word | Pdf | Excel | Image. Auto generated from document url."
    )
    documentType: string;

    @Enum(Priority)
    @Description("Priority of a task. Supported priorities are Low | Medium | High.")
    priority: Priority;

    @Description("Sequence of a task. Sent by the client so that tasks can be sorted by sequence if desired.")
    sequence = 0;

    @Description("Only for leads.")
    email: string;

    @Description("Deal price.")
    estDeal: string;

    @Description("Deal currency for leads")
    estDealCurrency: string;
}

// Schema Definition
export const TaskSchemaDefinition = {
    projectSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ProjectSectionsUtils.MODEL_NAME,
        validate: getForeignKeyValidator.call(this, ProjectSectionsUtils.MODEL_NAME, ERROR_PROJECT_SECTION_MISSING),
        required: [true, ERROR_PROJECT_SECTION_MISSING],
        index: true,
    },
    taskName: {
        type: String,
        required: [true, ERROR_TASK_NAME_MISSING],
        minLength: [TaskUtils.TASK_NAME_MIN_LENGTH, ERROR_TASK_NAME_MIN_LENGTH],
        maxLength: [TaskUtils.TASK_NAME_MAX_LENGTH, ERROR_TASK_NAME_MAX_LENGTH],
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
        ref: TaskStatusUtils.MODEL_NAME,
        validate: getForeignKeyValidator.call(this, TaskStatusUtils.MODEL_NAME, ERROR_TASK_STATUS_NAME_MISSING),
    },
    tags: {
        type: [String],
        default: [TaskTags.DEFAULT],
    },
    score: {
        type: Number,
        enum: [...Object.values(Score)],
        default: Score.NO_SCORE,
    },
    documentUrl: String,
    documentType: {
        type: String,
        enum: [...Object.values(GenericDocumentTypes)],
    },
    priority: {
        type: String,
        enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH],
    },
    sequence: {
        type: Number,
        default: 0,
    },
    email: String,
    estDeal: Number,
    estDealCurrency: {
        type: String,
        validate: {
            validator: function (estDealCurrency: string): Promise<boolean> {
                if (_.isUndefined(this.estDeal)) {
                    return Promise.resolve(true);
                }
                return new Promise(function (resolve, reject) {
                    CurrencyModel.findOne({ unit: estDealCurrency as Currencies }).exec((err, res) => {
                        if (err) {
                            reject(new NotFound(ERROR_CURRENCY_MISSING));
                        }
                        resolve(true);
                    });
                });
            },
            message: ERROR_CURRENCY_MISSING,
        },
        required: function (): boolean {
            return !_.isUndefined(this.estDeal) && _.isNumber(this.estDeal);
        },
    },
};

export const TaskSchema = new mongoose.Schema(TaskSchemaDefinition);

// Hooks
TaskSchema.pre<Task & mongoose.Document>("save", async function (next: HookNextFunction) {
    if (!this.status) {
        const taskStatus = await TaskStatusModel.findOne({ name: TaskStatusUtils.STATUS.READY });
        this.status = taskStatus._id;
    }
    if (!this.tags) {
        this.tags = [];
    }
    if (!_.includes(this.tags, TaskTags.DEFAULT)) {
        this.tags = [TaskTags.DEFAULT, ...this.tags];
    }
    if (!_.isEmpty(this.documentUrl)) {
        // Save documentType
        const documentType = getDocumentTypeFromUri(this.documentUrl);
        if (documentType) {
            this.documentType = documentType;
        }
    }
    next();
});

export const TaskModel = mongoose.model<Task & mongoose.Document>(TaskUtils.MODEL_NAME, TaskSchema);
