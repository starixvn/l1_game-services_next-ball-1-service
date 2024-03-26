import { BET_CHOICES } from "../constants";

export const roundBetPercentage = (betPercentage: Record<string, number>) => {
    betPercentage[BET_CHOICES.over] && (betPercentage[BET_CHOICES.over] = parseInt(betPercentage[BET_CHOICES.over].toString()));
    betPercentage[BET_CHOICES.under] && (betPercentage[BET_CHOICES.under] = parseInt(betPercentage[BET_CHOICES.under].toString()));
    betPercentage[BET_CHOICES.odd] && (betPercentage[BET_CHOICES.odd] = parseInt(betPercentage[BET_CHOICES.odd].toString()));
    if (betPercentage[BET_CHOICES.even] > 0) {
        betPercentage[BET_CHOICES.even] = 100 - (betPercentage[BET_CHOICES.even] ?? 0) - (betPercentage[BET_CHOICES.even] ?? 0);
    }

    return betPercentage;
};
