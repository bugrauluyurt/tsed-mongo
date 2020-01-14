import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import { registerDotEnvFiles } from "../config/env";
import "@tsed/mongoose";
import "@tsed/swagger";
import * as path from "path";
import { getSettings } from "../config/settings";

const rootDir = path.resolve(__dirname);
const { server: serverSettings } = getSettings(rootDir);
registerDotEnvFiles();

@ServerSettings(serverSettings)
export class Server extends ServerLoader {
  $beforeRoutesInit(): void | Promise<any> {

    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override"),
      rfs = require("rotating-file-stream"),
      morgan = require("morgan");

    // create a rotating write stream for logging
    const accessLogStream = rfs.createStream("access.log", {
      interval: "1d", // rotate daily
      path: path.resolve(__dirname, "../logs"),
    });

    this
      .use(morgan("common", { stream: accessLogStream }))
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }
}
