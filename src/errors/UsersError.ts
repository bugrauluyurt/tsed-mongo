import { UserUtils } from "../models/users/User.utils";

export const ERROR_INVALID_USER_ID = "User id is invalid.";
export const ERROR_USER_MISSING = "User with given id does not exist.";
export const ERROR_USER_NAME_MIN_LENGTH = `User name should be at least ${UserUtils.USER_NAME_MIN_LENGTH} characters long.`;
export const ERROR_USER_NAME_MAX_LENGTH = `User name should be max ${UserUtils.USER_NAME_MAX_LENGTH} characters long.`;
export const ERROR_USER_EMAIL_MIN_LENGTH = `User email should be at least ${UserUtils.USER_EMAIL_MIN_LENGTH} characters long.`;
export const ERROR_USER_EMAIL_MAX_LENGTH = `User email should be max ${UserUtils.USER_EMAIL_MAX_LENGTH} characters long.`;
export const ERROR_USER_EMAIL_MISSING = "User email is required.";
export const ERROR_USER_PASSWORD_MISSING = "User password is required.";
export const ERROR_USER_EMAIL_INVALID = "Invalid email.";
export const ERROR_USER_COMPANY_MISSING = "Users should have an associated company.";
