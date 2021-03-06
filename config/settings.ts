import * as chalk from "chalk";
import { MongoStoreFactory } from "connect-mongo";
import { CookieOptions } from "express";
import * as fs from "fs";
import { Connection } from "mongoose";
import * as path from "path";
import { User } from "../src/models/users/User";
import { logObject, logWithColor } from "../src/utils/default";
import { getMongoConnectionOptions } from "./connection";
import { getMongoUrl, getSecret } from "./env";
import { GraphQLSettings } from "@tsed/graphql";

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
            touchAfter: 24 * 3600, // time period in seconds
        }),
        resave: true, // do not automatically write to the session store
        saveUninitialized: false,
        maxAge: 36000,
        proxy: true, // trust the reverse proxy when setting secure cookies (X-Forwarded-Proto header will be used)
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: null,
        } as CookieOptions,
    };
    if (process.env.DOMAIN_CLIENT) {
        sessionSettings.cookie.domain = process.env.DOMAIN_CLIENT;
    }
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
                `${rootDir}/graphql/**/*.ts`, // add this pattern to scan resolvers or datasources from graphql
            ],
            mongoose: {
                urls: {
                    default: {
                        url: getMongoUrl(),
                        connectionOptions: getMongoConnectionOptions(),
                    },
                },
            },
            passport: {
                userInfoModel: User,
            },
            swagger: {
                path: "/api-docs",
            },
            socketIO: {
                origins: `https://${process.env.DOMAIN_CLIENT}:* http://localhost:*`,
                // @TODO: Add redis as socketIO adapter. Use socketio/socket.io-redis and 'socket.io-emitter'
            },
            // Do not name this as 'graphql'! If named like that, tsed.io directly initializes graphql without any control
            graphqlSettings: {
                path: "/graphql",
                server1: {
                    // Apollo server configuration
                    engine: {
                        apiKey: process.env.APOLLO_KEY,
                        graphVariant: process.env.NODE_ENV,
                        reportSchema: true,
                        variant: "current",
                    },
                    cors: true,
                    playground: process.env.NODE_ENV === "development",
                },
            } as GraphQLSettings,
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
