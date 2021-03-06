import { ProjectSectionsUtils } from "../models/projectSections/ProjectSection.utils";

export const ERROR_PROJECT_SECTION_ID_MISSING = "Project section id missing.";
export const ERROR_NO_PROJECT_SECTION_NAME = "Please provide a project section name";
export const ERROR_PROJECT_SECTION_MISSING = "Project section missing.";
export const ERROR_PROJECT_SECTION_NAME_MIN_LENGTH = `Project section name should be min ${ProjectSectionsUtils.MIN_PROJECT_SECTION_NAME} characters`;
export const ERROR_PROJECT_SECTION_NAME_MAX_LENGTH = `Project section name should be max ${ProjectSectionsUtils.MAX_PROJECT_SECTION_NAME} characters`;
