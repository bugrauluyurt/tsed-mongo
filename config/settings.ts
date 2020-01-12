import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { logWithColor } from "../utils/default";

const logSettings = ({ server, morgan }: { [key: string]: any }): void => {
    const boundaryLine = "----------------------------------------";
    console.log(chalk.green(boundaryLine));
    Object.keys(server).forEach((settingKey: string) => {
        if (settingKey === "httpsOptions") {
            return;
        }
        const settingValue = server[settingKey];
        logWithColor(settingKey, settingValue);
    });
    logWithColor("morgan", morgan);
    console.log(chalk.green(boundaryLine));
};

export const getSettings = (rootDir: string): { [key: string]: any } => {
    const httpsOptions = {
        key: fs.readFileSync(path.resolve(rootDir, "../ssl/key.pem"), "utf-8"),
        cert: fs.readFileSync(path.resolve(rootDir, "../ssl/certificate.pem"), "utf-8"),
        passphrase: process.env.PASSPHRASE,
    };

    const settings = {
        server: {
            rootDir,
            env: process.env.NODE_ENV,
            port: process.env.PORT,
            httpsPort: false,
            acceptMimes: ["application/json"],
            mount: {
                "/rest": `${rootDir}/controllers/**/**.ts`,
            },
            mongoose: {
                url: process.env.MONGO_URL
            },
            passport: {},
            swagger: {
                path: "/api-docs"
            },
        },
        morgan: process.env.MORGAN_CONFIG,
    } as { [key: string]: any };

    // On prod env put nginx in front of the server for secure connections. In case of HTTP/2 on app level
    // production env should start a https connection too. However nginx level HTTP/2 support is recommended
    if (process.env.HTTPS_ENABLED === "1") {
        settings.server.httpsOptions = httpsOptions;
        settings.server.httpsPort = process.env.HTTPS_PORT;
        settings.server.httpPort = false;
    }

    settings.server.debug = process.env.DEBUG || false;

    logSettings(settings);
    return settings;
};
