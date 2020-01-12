import * as mongoose from "mongoose";
import * as Bluebird from "bluebird";
import { Model } from "mongoose";
import * as chalk from "chalk";
import { logWithColor } from "../../utils/default";

export interface SeedOptions {
    clearBeforeSeed: boolean;
    documentCount: number;
}

export type ISeedState = { [collectionName: string]: any[] };

export class SeedState {
    private state: ISeedState = {};

    getState(): ISeedState {
        return this.state;
    }

    getCollection(collectionName: string): any[] {
        return this.state[collectionName];
    }

    updateState(partialState: ISeedState): ISeedState {
        this.state = {...partialState, ...this.state};
        return this.state;
    }
}

export class Seed<IModel> {
    private model: Model<IModel & mongoose.Document>;
    private insertManyFn: (beforeEachItems: any[], index: number, seedState: SeedState, preSeedResponse: any[]) => IModel;
    private options: SeedOptions = {
        clearBeforeSeed: true,
        documentCount: 1,
    };
    private preSeedBatch: Promise<any>[] = [];
    private postSeedBatch: Promise<any>[] = [];
    private beforeEachBatch: Array<() => Promise<any>> = [];
    public name: string;

    constructor(
        model: Model<IModel & mongoose.Document>,
        name: string,
        options: Partial<SeedOptions> = {}
    ) {
        this.model = model;
        this.name = name;
        this.updateOptions(options);
    }

    private preSeedExec(seedState: SeedState): Promise<any> {
        return Bluebird.mapSeries(this.preSeedBatch, (preSeedItem) => {
        });
    }

    private seedExec(seedState: SeedState, preSeedResponse: any[]): Promise<any> {
        let seriesIndex = 0;
        const seedBatch = [];
        while (seriesIndex < this.options.documentCount) {
            seedBatch.push(
                Bluebird.mapSeries(
                    this.beforeEachBatch,
                    (beforeEachItem) => beforeEachItem)
                    .then((beforeEachItems: any[]) => {
                        const template = this.insertManyFn(beforeEachItems, seriesIndex, seedState, preSeedResponse, );
                        return this.model.create(template);
                    })
            );
            seriesIndex += 1;
        }
        return Promise.all(seedBatch);
    }

    private postSeedExec(seedState: SeedState): Promise<any> {
        return Bluebird.mapSeries(this.postSeedBatch, (postSeedItem) => {
        });
    }

    seed(seedState: SeedState): Promise<any> {
        if (!this.insertManyFn) {
            logWithColor("Seed Error", "Please set a seed insertion function!", false, chalk.red);
            return Promise.reject();
        }
        return Promise.resolve()
            .then(() => this.preSeedExec(seedState))
            .then((preSeedResponse: any[]) => this.seedExec(seedState, preSeedResponse))
            .then(() => this.postSeedExec(seedState));
    }

    insertMany(
        insertManyFn: (beforeEachItem: any[], index: number, seedState: SeedState, preSeedResponse: any[]) => IModel,
        documentCount?: number | undefined
    ): Seed<IModel> {
        if (documentCount) {
            this.updateOptions({ documentCount });
        }
        this.insertManyFn = insertManyFn;
        return this;
    }

    updateOptions(optionsPartial: Partial<SeedOptions>): Seed<IModel> {
        this.options = {...this.options, ...optionsPartial};
        if (this.options.clearBeforeSeed) {
            const removePromise = new Promise((resolve, reject) => {
                this.model.deleteMany({}, () => resolve());
            });
            this.preSeedBatch.push(removePromise);
        }
        return this;
    }

    preSeed(preSeedVal: Promise<any>): Seed<IModel> {
        this.preSeedBatch.push(preSeedVal);
        return this;
    }

    postSeed(preSeedVal: Promise<any>): Seed<IModel> {
        this.preSeedBatch.push(preSeedVal);
        return this;
    }

    public beforeEach(beforeEachBatch: Array<() => Promise<any>>): Seed<IModel> {
        this.beforeEachBatch = beforeEachBatch;
        return this;
    }

}
