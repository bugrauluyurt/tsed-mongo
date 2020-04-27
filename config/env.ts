/* eslint-disable @typescript-eslint/no-var-requires */
const paths = require("./paths");
const fs = require("fs");

export const isDev = () => process.env.NODE_ENV === "development";
export const isProd = () => process.env.NODE_ENV === "production";
export const getSecret = () => process.env.PASSPHRASE || "";
export const getMongoUrl = () => `${process.env.MONGO_URL}/${process.env.MONDO_DB_NAME}`;

export const registerDotEnvFiles = () => {
    const dotenvFiles = [].filter(Boolean);

    if (this.isProd()) {
        dotenvFiles.push(paths.dotenv.prod);
    } else {
        dotenvFiles.push(paths.dotenv.dev);
    }

    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            require("dotenv").config({
                path: dotenvFile,
            });
        }
    });
};
