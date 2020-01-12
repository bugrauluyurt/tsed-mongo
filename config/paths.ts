// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const paths = {
    dotenv: {
        dev: resolveApp(".env/dev.env"),
        prod: resolveApp(".env/prod.env"),
    },
};

module.exports = paths;
