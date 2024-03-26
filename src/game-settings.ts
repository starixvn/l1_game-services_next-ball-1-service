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
    choicesMapper: { player: 1, banker: 2, tie: 3 },
    hedgeBetGroups: [
        ["over", "under"],
        ["odd", "even"],
    ],
    numberOfTurnsPerRound: 8,
    numberOfRoundHistory: 108,
    historyPageSize: 30,
    provablyFair: true,
    botSettings: {
        ratio: { mainBetOptions: 70, rareBetOptions: 30 },
        mainBetOptions: ["over", "under"],
        rareBetOptions: ["odd", "even"],
    },
};
