import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { TaskModel, Task } from "../../models/tasks/Task";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_TASK_ID_MISSING } from "../../errors/TasksError";
import { ERROR_PROJECT_SECTION_ID_MISSING } from "../../errors/ProjectSectionsError";
import * as _ from "lodash";

@Service()
export class TasksService {
    private Task: MongooseModel<Task>;

    constructor() {
        this.Task = TaskModel as MongooseModel<Task>;
    }

    async getTask(taskId: string): Promise<Task> {
        if (!taskId) {
            throw new BadRequest(ERROR_TASK_ID_MISSING);
        }
        return await this.Task.findById(taskId).exec();
    }

    async getTasksByProjectSectionId(projectSectionId: number): Promise<Task[]> {
        if (!projectSectionId) {
            throw new BadRequest(ERROR_PROJECT_SECTION_ID_MISSING);
        }
        return await this.Task.find({ projectSectionId }).exec();
    }

    async addTask(task: Task): Promise<Task> {
        const model = new this.Task(task);
        return await this.Task.create(model);
    }

    async updateTask(taskId: string, taskPartial: Partial<Task>): Promise<Task> {
        if (_.isEmpty(taskId)) {
            throw new BadRequest(ERROR_TASK_ID_MISSING);
        }
        return await this.Task.findByIdAndUpdate(taskId, taskPartial, {
            omitUndefined: true,
            new: true,
            runValidators: true,
        }).exec();
    }

    async removeTask(taskId: string): Promise<Task> {
        if (_.isEmpty(taskId)) {
            throw new BadRequest(ERROR_TASK_ID_MISSING);
        }
        return await this.Task.findByIdAndDelete(taskId).exec();
    }
}
