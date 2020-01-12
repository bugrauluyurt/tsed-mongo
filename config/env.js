/*eslint-disable */
const paths = require("./paths");
const fs = require("fs");

exports.isDev = () => process.env.NODE_ENV === "development";
exports.isProd = () => process.env.NODE_ENV === "production";

exports.registerDotEnvFiles = () => {
    const dotenvFiles = [].filter(Boolean);

    if (this.isProd()) {
        dotenvFiles.push(paths.dotenv.prod);
    } else {
        dotenvFiles.push(paths.dotenv.dev);
    }

    dotenvFiles.forEach(dotenvFile => {
        if (fs.existsSync(dotenvFile)) {
            require("dotenv").config({
                path: dotenvFile,
            });
        }
    });
};
