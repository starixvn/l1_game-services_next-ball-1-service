import { BET_CHOICES } from "./constants";

export default {
    id: 1003,
    name: "NextBall1",
    durations: {
        wholeRound: 212,
        placingBets: 20,
        lockingBet: 3,
        showingResult: 3,
        wholeTurn: 26,
        startingRound: 4,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { over: 1, under: 2, odd: 3, even: 4 },
    hedgeBetGroups: [
        ["over", "under"],
        ["odd", "even"],
    ],
    numberOfTurnsPerRound: 8,
    numberOfRoundHistory: 108,
    historyPageSize: 30,
    provablyFair: true,
    botSettings: {
        ratio: { overUnderOptions: 50, oddEvenOptions: 50 },
        overUnderOptions: ["over", "under"],
        oddEvenOptions: ["odd", "even"],
    },
};
