import { UserRole } from "./User";

export interface IUser {
    _id?: string;
    name?: string;
    password: string;
    email: string;
    phone?: string;
    address?: string;
    roles: UserRole[];
}
