import { UserRole } from "../../models/users/UserRole";
import { UserCompanyRole } from "../../models/users/UserCompanyRole";

export interface IUser {
    _id?: string;
    name?: string;
    password: string;
    email: string;
    phone?: string;
    address?: string;
    companies: string[];
    roles: UserRole[];
    companyRoles: UserCompanyRole[];
}
