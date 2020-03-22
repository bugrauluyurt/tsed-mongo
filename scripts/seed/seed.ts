import * as mongoose from "mongoose";
import * as Bluebird from "bluebird";
import { Model } from "mongoose";
import * as chalk from "chalk";
import { logWithColor } from "../../utils/default";
import * as _ from "lodash";

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

type AfterEachBatchItem = (documentIndex: number, createdDocument: object | any, seedState: SeedState) => Promise<any>;

export class Seed<IModel> {
    private model: Model<IModel & mongoose.Document>;
    private iteratorFn: (beforeEachItems: any[], index: number, seedState: SeedState, preSeedResponse: any[]) => IModel;
    private options: SeedOptions = {
        clearBeforeSeed: true,
        documentCount: 1,
    };
    private preSeedBatch: Promise<any>[] = [];
    private postSeedBatch: Promise<any>[] = [];
    private beforeEachBatch: Array<() => Promise<any>> | Array<Promise<any>> = [];
    private afterEachBatch: Array<AfterEachBatchItem> = [];
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

    private beforeEachExec(): Promise<any> {
        return Bluebird.mapSeries(
            this.beforeEachBatch,
            (beforeEachItem) => _.isFunction(beforeEachItem) ? beforeEachItem() : beforeEachItem
        );
    }

    private afterEachExec(documentIndex: number, createdDocument: IModel, seedState: SeedState): Promise<any> {
        return Bluebird.mapSeries(
            this.afterEachBatch,
            (afterEachItem) => _.isFunction(afterEachItem)
                ? afterEachItem(documentIndex, createdDocument, seedState)
                : afterEachItem
        );
    }

    private prepareDocumentSeed(documentIndex: number, seedState: SeedState, preSeedResponse: any[]): Promise<any> {
        return Promise.resolve()
            .then(() => this.beforeEachExec())
            .then((beforeEachItems: any[]) => {
                const template = this.iteratorFn(beforeEachItems, documentIndex, seedState, preSeedResponse);
                return this.model.create(template);
            })
            .then((createdDocument) => {
                return this.afterEachExec(documentIndex, createdDocument, seedState).then(() => createdDocument);
            });
    }

    private preSeedExec(seedState: SeedState): Promise<any> {
        return Bluebird.mapSeries(this.preSeedBatch, (preSeedItem) => {
        });
    }

    private seedExec(seedState: SeedState, preSeedResponse: any[]): Promise<any> {
        let seriesIndex = 0;
        const seedBatch = [];
        while (seriesIndex < this.options.documentCount) {
            seedBatch.push(this.prepareDocumentSeed(seriesIndex, seedState, preSeedResponse));
            seriesIndex += 1;
        }
        return Promise.all(seedBatch);
    }

    private postSeedExec(seedState: SeedState): Promise<any> {
        return Bluebird.mapSeries(this.postSeedBatch, (postSeedItem) => {
        });
    }

    seed(seedState: SeedState): Promise<any> {
        if (!this.iteratorFn) {
            logWithColor("Seed Error", "Please set a seed insertion function!", false, chalk.red);
            return Promise.reject();
        }
        return Promise.resolve()
            .then(() => this.preSeedExec(seedState))
            .then((preSeedResponse: any[]) => this.seedExec(seedState, preSeedResponse))
            .then((seededItems) => this.postSeedExec(seedState).then(() => seededItems));
    }

    insertMany(
        iteratorFn: (beforeEachItem: any[], index: number, seedState: SeedState, preSeedResponse: any[]) => IModel,
        documentCount?: number | undefined
    ): Seed<IModel> {
        if (documentCount) {
            this.updateOptions({documentCount});
        }
        this.iteratorFn = iteratorFn;
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

    public beforeEach(beforeEachBatch: Array<() => Promise<any>> | Array<Promise<any>>): Seed<IModel> {
        this.beforeEachBatch = beforeEachBatch;
        return this;
    }

    public afterEach(afterEachBatch: Array<AfterEachBatchItem>): Seed<IModel> {
        this.afterEachBatch = afterEachBatch;
        return this;
    }

}
