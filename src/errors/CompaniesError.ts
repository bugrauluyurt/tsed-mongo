import { CompanyUtils } from "../models/companies/Company.utils";

export const ERROR_NO_COMPANY = "Company is not found.";
export const ERROR_NO_COMPANY_ID = "Company id missing.";
export const ERROR_COMPANY_NAME_MISSING = "Company name missing.";
export const ERROR_COMPANY_NAME_MIN_LENGTH = `Company name should be min ${CompanyUtils.MIN_NAME} characters`;
export const ERROR_COMPANY_NAME_MAX_LENGTH = `Company name should be max ${CompanyUtils.MAX_NAME} characters`;
export const ERROR_COMPANY_DOMAIN_NAME_MIN_LENGTH = `Company domain name should be min ${CompanyUtils.MIN_DOMAIN_NAME} characters`;
export const ERROR_COMPANY_DOMAIN_NAME_MAX_LENGTH = `Company domain name should be ming ${CompanyUtils.MAX_DOMAIN_NAME} characters`;
