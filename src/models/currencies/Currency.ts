import { ObjectID, MongooseSchema, Indexed } from "@tsed/mongoose";
import { Enum, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Schema } from "mongoose";
import * as mongoose from "mongoose";
import { Currencies } from "../../enums/Currencies";
import { ERROR_CURRENCY_MISSING } from "../../errors/CurrencyError";
import { CurrencyUtils } from "./Currency.utils";

@MongooseSchema()
export class Currency {
    @ObjectID("id")
    _id: string;

    @Enum(Currencies)
    @Required()
    @Indexed()
    @Description("Currency")
    code: Currencies;
}

// Schema Definition
export const CurrencySchemaDefinition = {
    code: {
        type: String,
        required: [true, ERROR_CURRENCY_MISSING],
        enum: [...Object.values(Currencies)],
    },
};

export const CurrencySchema = new Schema(CurrencySchemaDefinition);
export const CurrencyModel = mongoose.model<Currency & mongoose.Document>(CurrencyUtils.MODEL_NAME, CurrencySchema);
