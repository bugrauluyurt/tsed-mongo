import { Seed, SeedState } from "../seed";
import { Currency, CurrencyModel } from "../../../src/models/currencies/Currency";
import { Currencies } from "../../../src/enums/currencies";
import { CurrencyUtils } from "../../../src/models/currencies/Currency.utils";

const currenciesValues = Object.values(Currencies);
const currenciesCount = currenciesValues.length;

module.exports = {
    seed: new Seed<Currency>(CurrencyModel, CurrencyUtils.COLLECTION_NAME, {
        documentCount: currenciesCount,
    }).insertMany((beforeEachResponse: string[], index: number, seedState: SeedState, preSeedResponse) => {
        // INFO
        // Previous seeded collections can be reached at each document level by using seedState instance.
        // seedState.getState() OR seedState.getCollection(collectionName)
        const currencyUnit = currenciesValues[index];
        return {
            code: currencyUnit,
        } as Currency;
    }),
};
