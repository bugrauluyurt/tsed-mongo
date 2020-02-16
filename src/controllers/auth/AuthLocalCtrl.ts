import { BodyParams, Controller, Get, Post, Req, Required, UseAfter } from "@tsed/common";
import * as Express from "express";
import * as Passport from "passport";
import { BadRequest } from "ts-httpexceptions";
import { checkEmail } from "../../../utils/checkEmail";
import { checkPassword } from "../../../utils/checkPassword";
import { IUser } from "../../models/users/User.interface";

function passportAuthenticate(event: string) {
    return (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
        Passport
            .authenticate(event, (err, user: IUser) => {
                if (err) return next(err);
                if (!user) {
                    return next(new BadRequest("Wrong email or password"));
                }

                request.logIn(user, (err) => {
                    if (err) return next(err);
                    response.json(user);
                });

            })(request, response, next);
    };
}

@Controller("/auth/local")
export class AuthLocalCtrl {
    /**
     * Authenticate user with local info (in Database).
     * @param email
     * @param password
     */
    @Post("/login")
    @UseAfter(passportAuthenticate("login"))
    async login(@Required() @BodyParams("email") email: string,
                @Required() @BodyParams("password") password: string) {
        checkEmail(email);
        checkPassword(password);
        // DO SOMETHING
    }

    /**
     * Try to register new account
     * @param name
     * @param email
     * @param password
     */
    @Post("/signup")
    @UseAfter(passportAuthenticate("signup"))
    async signup(@Required() @BodyParams("name") name: string,
                 @Required() @BodyParams("email") email: string,
                 @Required() @BodyParams("password") password: string) {
        checkEmail(email);
        checkPassword(password);
        // DO SOMETHING
    }

    /**
     * Disconnect user
     * @param request
     */
    @Get("/logout")
    public logout(@Req() request: Express.Request): string {
        request.logout();
        return "Disconnected";
    }
}
