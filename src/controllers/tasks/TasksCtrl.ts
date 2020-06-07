import { Controller, Post, Req, Status, UseAuth } from "@tsed/common";
import { TasksService } from "../../services/tasks/TasksService";
import { Summary } from "@tsed/swagger";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { UserRole } from "../../models/users/UserRole";
import { Task } from "../../models/tasks/Task";

@Controller("/tasks")
export class TasksCtrl {
    constructor(private tasksService: TasksService) {}

    @Post("/add")
    @Summary("Adds a task")
    @Status(200, {
        description: "Success",
        type: Task,
        collectionType: Task,
    })
    @UseAuth(AuthMiddleware, { roles: [UserRole.ADMIN, UserRole.PROJECT_ADMIN] })
    async addProject(req: Req): Promise<Task> {
        return this.tasksService.addTask(req.body as Task);
    }
}
