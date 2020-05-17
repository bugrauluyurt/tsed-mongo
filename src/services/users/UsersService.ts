import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import * as _ from "lodash";
import { $log } from "ts-log-debug";
import { isDev } from "../../../config/env";
import { User } from "../../models/users/User";

@Service()
export class UsersService {
    @Inject(User)
    private User: MongooseModel<User>;

    $onInit() {
        if (isDev()) {
            this.reload();
        }
    }

    async reload() {
        const users = await this.User.find({});

        if (users.length === 0) {
            const promises = require("../../../resources/users.json").map((user) => this.save(user));
            await Promise.all(promises);
        }
    }

    async findById(id: string): Promise<User> {
        $log.debug("Search a user by ID", id);
        const user = await this.User.findById(id).select("-password").exec();

        $log.debug("User found", user);
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        $log.debug("Search a user by email", email);
        const users = await this.query({ email });
        $log.debug("Users found", users);
        return _.get(users, "0");
    }

    async findByCredential(email: string, password: string): Promise<User> {
        $log.debug("Search a user by email", email);
        const users = await this.query({ email, password });
        $log.debug("Users found", users);
        return _.get(users, "0");
    }

    async save(user: Partial<User>): Promise<User> {
        $log.debug({ message: "Validate user", User });

        const model = new this.User(user);
        $log.debug({ message: "Save user", user });
        await model.save();

        $log.debug({ message: "User saved", model });

        return model;
    }

    async query(options: Partial<User> = {}): Promise<User[]> {
        return this.User.find(options).exec();
    }

    async remove(id: string): Promise<User> {
        return await this.User.findById(id).remove().exec();
    }
}
