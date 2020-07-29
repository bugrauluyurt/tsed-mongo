import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { BadRequest } from "ts-httpexceptions";
import * as _ from "lodash";
import { TaskStatus, TaskStatusModel } from "../../models/taskStatuses/TaskStatus";
import { ERROR_TASK_STATUS_ID_MISSING } from "../../errors/TaskStatusError";
import * as mongoose from "mongoose";
import { TaskStatusUtils } from "../../models/taskStatuses/TaskStatus.utils";
import validator from "validator";
import { isValidMongoId } from "../../utils/isValidMongoId";

@Service()
export class TaskStatusesService {
    private TaskStatus: MongooseModel<TaskStatus>;

    constructor() {
        this.TaskStatus = TaskStatusModel as MongooseModel<TaskStatus>;
    }

    async findTaskStatus(taskStatusIds?: string[], taskStatusName?: string): Promise<TaskStatus[]> {
        const condition = _.reduce(
            taskStatusIds || [],
            (acc, taskStatusId) => {
                if (isValidMongoId(taskStatusId)) {
                    if (!acc["_id"]) {
                        acc["_id"] = [];
                    }
                    acc["_id"].push(mongoose.Types.ObjectId(taskStatusId));
                }
                return acc;
            },
            {}
        );
        if (!_.isEmpty(taskStatusName)) {
            condition["name"] = taskStatusName;
        }
        return await this.TaskStatus.find(condition).limit(_.keys(TaskStatusUtils.STATUS).length).exec();
    }

    async findTaskStatusById(taskStatusId: string): Promise<TaskStatus> {
        if (!taskStatusId || !isValidMongoId(taskStatusId)) {
            throw new BadRequest(ERROR_TASK_STATUS_ID_MISSING);
        }
        return await this.TaskStatus.findById(taskStatusId).exec();
    }
}
