import {
    BodyParams,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    Required,
    Status,
    UseAuth,
    Session,
} from "@tsed/common";
import { Summary } from "@tsed/swagger";
import { NotFound } from "ts-httpexceptions";
import { AuthMiddleware } from "../../middlewares/auth/AuthMiddleware";
import { UserRolesAll } from "../../models/users/UserRole";
import { UsersService } from "../../services/users/UsersService";
import { User } from "../../models/users/User";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller("/users")
export class UsersCtrl {
    constructor(private usersService: UsersService) {
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<IUser>}
     */
    @Get("/currentUser")
    @Summary("Return the active session user")
    @UseAuth(
        AuthMiddleware,
        {roles: UserRolesAll}
    )
    @Status(200, {description: "Success", type: User})
    async get(@Session() session: any): Promise<User> {
        const userData = await this.usersService.findById(session.passport.user);
        if (userData) {
            return userData;
        }
        throw new NotFound("User not found");
    }
}
