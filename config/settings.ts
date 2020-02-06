import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { logObject, logWithColor } from "../utils/default";
import { getMongoUrl, getSecret } from "./env";
import { Connection } from "mongoose";
import { MongoStoreFactory } from "connect-mongo";
import { getMongoConnectionOptions } from "./connection";
import { User } from "../src/models/users/User";

const logSettings = ({ server, morgan }: { [key: string]: any }): void => {
    const boundaryLine = "----------------------------------------";
    console.log(chalk.green(boundaryLine));
    logObject(server);
    logWithColor("morgan", morgan);
    console.log(chalk.green(boundaryLine));
};

export const getSessionSettings = (MongoStore: MongoStoreFactory, mongooseConnection: Connection): object => {
    const secret = getSecret();
    const sessionSettings = {
        secret,
        store: new MongoStore({
            mongooseConnection,
            secret,
            touchAfter: 24 * 3600 // time period in seconds
        }),
        resave: true, // do not automatically write to the session store
        saveUninitialized: false,
        maxAge: 36000,
        proxy: true, // trust the reverse proxy when setting secure cookies (X-Forwarded-Proto header will be used)
        cookie: {
            path: "/",
            httpOnly: true,
            secure: true,
            maxAge: null,
        }
    };
    logObject(sessionSettings, true);
    return sessionSettings;
};

export const getServerSettings = (rootDir: string): { [key: string]: any } => {
    const httpsOptions = {
        key: fs.readFileSync(path.resolve(rootDir, "../ssl/key.pem"), "utf-8"),
        cert: fs.readFileSync(path.resolve(rootDir, "../ssl/certificate.pem"), "utf-8"),
        passphrase: getSecret(),
    };

    const settings = {
        server: {
            rootDir,
            env: process.env.NODE_ENV,
            port: process.env.PORT,
            httpsPort: false,
            acceptMimes: ["application/json"],
            logger: {
                debug: false, // change debug to true for extended debugging
                logRequest: true,
                requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"],
            },
            mount: {
                "/rest": `${rootDir}/controllers/**/**.ts`,
            },
            componentsScan: [
                `${rootDir}/services/**/**.ts`,
                `${rootDir}/middlewares/**/**.ts`,
            ],
            mongoose: {
                urls: {
                    default: {
                        url: getMongoUrl(),
                        connectionOptions: getMongoConnectionOptions(),
                    }
                },
            },
            passport: {
                userInfoModel: User
            },
            swagger: {
                path: "/api-docs"
            },
        },
        morgan: process.env.MORGAN_CONFIG,
    } as { [key: string]: any };

    // On prod env put nginx in front of the server for secure connections. In case of HTTP/2 on app level
    // production env should start a https connection too. However nginx level HTTP/2 support is recommended
    // tslint:disable-next-line:triple-equals
    if (process.env.HTTPS_ENABLED == "1") {
        settings.server.httpsOptions = httpsOptions;
        settings.server.httpsPort = process.env.HTTPS_PORT;
        settings.server.httpPort = false;
    }

    settings.server.debug = process.env.DEBUG || false;

    logSettings(settings);
    return settings;
};
