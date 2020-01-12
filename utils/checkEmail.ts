import { BadRequest } from "ts-httpexceptions";

const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function checkEmail(email: string) {
    if (!(email && regEmail.test(email))) {
        throw new BadRequest("Email is invalid");
    }
}
