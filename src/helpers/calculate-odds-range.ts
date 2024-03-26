import { Helpers } from "sc-number-game-base";

const MinProbability = {
    over: 30 / 67,
    under: 29 / 67,
    odd: 30 / 67,
    even: 29 / 67,
};

const MaxProbability = {
    over: 38 / 67,
    under: 37 / 67,
    odd: 38 / 67,
    even: 37 / 67,
};

export const calculateOddsRange = (margin?: Record<string, number>[]) => {
    return {
        min: Helpers.getBetOdds(MaxProbability, margin),
        max: Helpers.getBetOdds(MinProbability, margin),
    };
};
