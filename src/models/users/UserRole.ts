export enum UserRole {
    ADMIN = "admin",
    BASIC = "basic",
    SERVER = "server",
    PROJECT_ADMIN = "projectAdmin",
    PROJECT_MANAGER = "projectManager",
}

export const UserRolesAll = [
    UserRole.ADMIN,
    UserRole.BASIC,
    UserRole.SERVER,
    UserRole.PROJECT_ADMIN,
    UserRole.PROJECT_MANAGER,
];
