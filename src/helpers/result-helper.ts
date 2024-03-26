import { NextBall, Utils } from "@rd/numbers-game-probabilities";
import { DrawResult } from "../models/rounds";
import { OVER_FACTOR } from "../constants";

export type FinalSeeds = {
    serverSeed: string;
    finalHash: string;
};

export const generateResult = (finalSeeds: FinalSeeds) => {
    const serverSeed = JSON.parse(finalSeeds.serverSeed);

    const balls = serverSeed.remain.split(":").map((x: string) => +x);

    const random = +serverSeed.random;

    const increment = finalHashToNumber(finalSeeds.finalHash);

    const totalRemainingBalls = balls.length;

    const index = (random + increment) % totalRemainingBalls;

    return { ball: balls[index] };
};

export const finalHashToNumber = (finalHash: string) => {
    return parseInt(finalHash.slice(0, 2), 16);
};

export const getSettlementResult = (result: DrawResult) => {
    const over = Utils.isOver(OVER_FACTOR)(+result.ball);
    const odd = Utils.isOdd(+result.ball);

    return {
        over,
        under: !over,
        odd,
        even: !odd,
    };
};

export const getProbabilities = (roundResult: DrawResult[]) => {
    const balls = roundResult.map((drawResult) => +drawResult.ball);
    return NextBall.getProbabilities(balls);
};

export const generateRawResultForHash = () => {};
