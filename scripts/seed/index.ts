import { Seed, SeedState } from "./seed";
import { getMongoConnection } from "../../config/connection";
import { logWithColor } from "../../src/utils/default";

// Register env
require("../../config/env").registerDotEnvFiles();

// Put seed files here
const seeds = [
    require("./data/seedCurrencies").seed,
    require("./data/seedProjectTypes").seed,
    require("./data/seedMilestoneStatuses").seed,
    require("./data/seedTaskStatuses").seed,
    require("./data/seedCompanies").seed,
    require("./data/seedUsers").seed,
];

const seedPartials = (partialIndex, seedState: SeedState) => {
    const nextSeed: Seed<any> = seeds[partialIndex];
    if (!nextSeed) {
        logWithColor("[SEED]", "Seeding completed.", false);
        return process.exit(0);
    }
    logWithColor("[SEED]", `Seeding [${nextSeed.name}] into database...`, false);
    nextSeed
        .seed(seedState)
        .then((seededItems) => {
            seedState.updateState({ [nextSeed.name]: seededItems });
            seedPartials(partialIndex + 1, seedState);
        })
        .catch((err) => {
            logWithColor("[SEED]", { text: "Seed error!", err }, true);
            process.exit(1);
        });
};

getMongoConnection("[SEED]").then(() => {
    logWithColor("[SEED]", `DB Connection successful.`, false);
    logWithColor("[SEED]", `Initiating seed process...`, false);
    seedPartials(0, new SeedState());
});
