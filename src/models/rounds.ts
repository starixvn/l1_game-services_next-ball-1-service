import mongoose from "mongoose";

const modelName = "luckynext1_rounds";

export type DrawResult = {
    drawId: number;
    ball: number;
    time: Date;
};

const resultSchema = new mongoose.Schema<DrawResult>(
    {
        drawId: { type: Number, require: true },
        ball: { type: Number, required: true },
        time: { type: Date, default: new Date() },
    },
    {
        _id: false,
    }
);

export type DrawSettlementResult = {
    drawId: number;
    over: boolean;
    under: boolean;
    odd: boolean;
    even: boolean;
};

const settlementResultSchema = new mongoose.Schema<DrawSettlementResult>(
    {
        drawId: { type: Number, require: true },
        over: { type: Boolean, default: false },
        under: { type: Boolean, default: false },
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: { type: [resultSchema] },
    settlementResult: { type: [settlementResultSchema] },
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, require: true },
    drawId: { type: Number, require: true },
    ended: { type: Boolean, default: false },
});

export default mongoose.model(modelName, Schema);
