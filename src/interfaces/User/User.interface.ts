import { UserRole } from "../../models/users/UserRole";

export interface IUser {
    _id?: string;
    name?: string;
    password: string;
    email: string;
    phone?: string;
    address?: string;
    companies: string[];
    roles: UserRole[];
}
