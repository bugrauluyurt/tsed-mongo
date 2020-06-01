import { TaskUtils } from "../models/tasks/Task.utils";

export const ERROR_TASK_NAME_MISSING = "Task name missing.";
export const ERROR_TASK_NAME_MIN_LENGTH = `Task name should be min ${TaskUtils.TASK_NAME_MIN_LENGTH} characters.`;
export const ERROR_TASK_NAME_MAX_LENGTH = `Task name should be max ${TaskUtils.TASK_NAME_MAX_LENGTH} characters long.`;
export const ERROR_DATE_ORDER = "endDate should be after startDate.";
