import { Seed, SeedState } from "./seed";
import { logWithColor } from "../../utils/default";
import * as chalk from "chalk";

const mongoose = require("mongoose");

// Register env
require("../../config/env").registerDotEnvFiles();

// Put seed files here
const seeds = [
    require("./seedUsers")
];

const seedPartials = (partialIndex, seedState: SeedState) => {
    const nextSeed: Seed<any> = seeds[partialIndex];
    if (!nextSeed) {
        logWithColor("[SEED]", "Seeding completed.", false);
        return process.exit(0);
    }
    logWithColor("[SEED]", `Seeding [${nextSeed.name}] into database...`, false);
    nextSeed.seed(seedState).then((seededItems) => {
        seedState.updateState({ [nextSeed.name]: seededItems });
        seedPartials(partialIndex + 1, seedState);
    });
};

// Connect mongoose
const connectDB = async () => {
    const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/citrusnotesdb";
    try {
        logWithColor("[SEED]", `Connecting to DB -> ${dbUrl}`, false);
        await mongoose.connect(
            process.env.MONGO_URL || "mongodb://localhost:27017/citrusnotesdb",
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
    } catch (error) {
        logWithColor("[SEED ERROR]", `Connection to ${dbUrl} failed.`, false, chalk.red);
        process.exit(1);
    }
};
connectDB().then(() => {
    logWithColor("[SEED]", `DB Connection successful.`, false);
    logWithColor("[SEED]", `Initiating seed process...`, false);
    seedPartials(0,  new SeedState());
});

