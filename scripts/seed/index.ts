import { Seed, SeedState } from "./seed";
import { logWithColor } from "../../utils/default";
import { getMongoConnection } from "../../config/connection";

// Register env
require("../../config/env").registerDotEnvFiles();

// Put seed files here
const seeds = [
    require("./seedProjectTypes"),
    require("./seedTaskStatuses"),
    require("./seedCompanies"),
    require("./seedUsers"),
    require("./seedTeams"),
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

getMongoConnection("[SEED]").then(() => {
    logWithColor("[SEED]", `DB Connection successful.`, false);
    logWithColor("[SEED]", `Initiating seed process...`, false);
    seedPartials(0,  new SeedState());
});

