import { getMongoUrl } from "./env";
import { logWithColor } from "../utils/default";
import * as chalk from "chalk";
import * as mongoose from "mongoose";
import { ConnectionOptions, Mongoose } from "mongoose";

export const getMongoConnectionOptions = (): ConnectionOptions => {
    return { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
};

export const getMongoConnection = async (logContext = "Connection"): Promise<Mongoose> => {
    const dbUrl = getMongoUrl();
    try {
        logWithColor(logContext, `Connecting to DB -> ${dbUrl}`, false);
        if (mongoose.connection.readyState) {
            return Promise.resolve(mongoose);
        }
        await mongoose.connect(dbUrl, getMongoConnectionOptions());
    } catch (error) {
        logWithColor("Error", `Connection to ${dbUrl} failed.`, false, chalk.red);
        process.exit(1);
    }
};
