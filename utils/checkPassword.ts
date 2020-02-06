import { BadRequest } from "ts-httpexceptions";
import { isDev } from "../config/env";

// Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character
const regPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export function checkPassword(password: string) {
    if (isDev()) return true;
    if (!(password && regPassword.test(password))) {
        throw new BadRequest("Password pattern invalid");
    }
}
