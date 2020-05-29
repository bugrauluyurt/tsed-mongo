import mongoose, { Document } from "mongoose";

export type MongooseModel<T> = mongoose.Model<Document & T, {}>;
