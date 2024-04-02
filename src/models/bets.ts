import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    over: { type: Number, default: 0 },
    under: { type: Number, default: 0 },
    odd: { type: Number, default: 0 },
    even: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },
    totalAmount: { type: Number, default: 0 },

    clientSeed: { type: String, default: "" },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: String },
    operatorId: { type: String, required: false },
    roundId: { type: Number, default: 0, required: true },
    drawId: { type: Number, default: 0, required: true },
    paid: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "luckynext1_bets",
    new mongoose.Schema({
        ...bet,
        currency: { type: String },
        rate: { type: Number, required: true },
    })
);

const tmpBets = mongoose.model("luckynext1_tmpbets", new mongoose.Schema(bet));

export { bets, tmpBets };
