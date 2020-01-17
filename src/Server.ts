import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "@tsed/common";
import { isProd, registerDotEnvFiles } from "../config/env";
import "@tsed/mongoose";
import "@tsed/swagger";
import * as path from "path";
import { getServerSettings, getSessionSettings } from "../config/settings";
import { getMongoConnection } from "../config/connection";
import { MongoStoreFactory } from "connect-mongo";

registerDotEnvFiles();
const rootDir = path.resolve(__dirname);
const {server: serverSettings} = getServerSettings(rootDir);

@ServerSettings(serverSettings)
export class Server extends ServerLoader {

    async $beforeRoutesInit(): Promise<any> {
        await getMongoConnection();

        const cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override"),
            rfs = require("rotating-file-stream"),
            mongoose = require("mongoose"),
            session = require("express-session"),
            mongoStore: MongoStoreFactory = require("connect-mongo")(session),
            morgan = require("morgan");

        // create a rotating write stream for logging
        const accessLogStream = rfs.createStream("access.log", {
            interval: "1d", // rotate daily
            path: path.resolve(__dirname, "../logs"),
        });
        const sessionSettings = getSessionSettings(mongoStore, mongoose.connection);

        if (isProd()) {
            this.set("trust proxy", 1); // trust first proxy
        }

        this
            .use(morgan("common", {stream: accessLogStream}))
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(session(sessionSettings));

        return Promise.resolve();
    }
}
