import * as mongoose from "mongoose";
import { ForeignKeyValidator } from "../src/types/ForeignKeyValidator";
import { BadRequest } from "ts-httpexceptions";

export const foreignKeyHelper = (model, id): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        model.findOne({ _id: id }, (err, result) => {
            if (result) {
                return resolve(true);
            } else
                return reject(
                    new BadRequest(`ForeignKey Constraint 'checkObjectsExists' for '${id.toString()}' failed`)
                );
        });
    });
};

export const getForeignKeyValidator = function (model: string, errorMessage: string): ForeignKeyValidator {
    return {
        validator: (objectId: string): Promise<boolean> => {
            return foreignKeyHelper(mongoose.model(model), objectId);
        },
        message: errorMessage,
    };
};
