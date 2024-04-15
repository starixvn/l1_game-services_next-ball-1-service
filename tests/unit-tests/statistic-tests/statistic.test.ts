import { GameData, GameDefinition } from "sc-number-game-base";
import { RoundResultConsumer } from "../../../src/event-consumers";
import { stub } from "jest-auto-stub";
import { RoundResultPublisher } from "sc-number-game-base/dist/event-publishers";
import { ProvablyFairConsumer } from "sc-number-game-base/dist/event-consumers";
import * as Helpers from "../../../src/helpers/result-helper";
import Chance from "chance";
import { SeedHelper } from "sc-game-base/src/core/helpers";
import gameSettings from "../../../src/game-settings";
import { DrawResult } from "../../../src/models/rounds";
import { GameConfigs } from "sc-game-base/src/core/game-data";

const chance = new Chance();

function generateSeed(): string {
    return chance.ssn({ ssnFour: true });
}

describe("statistic test", () => {
    let consumer: RoundResultConsumer;
    const gameData = stub<GameData>();
    const definition = stub<GameDefinition>();
    const publisher = stub<RoundResultPublisher>();
    const provablyFairConsumer = stub<ProvablyFairConsumer>();
    const numberOfTurnsToRun = 50_000 * gameSettings.numberOfTurnsPerRound;

    beforeEach(() => {
        consumer = new RoundResultConsumer(gameData, definition, publisher, null, provablyFairConsumer);
        consumer.gameData.roundResult = [];
    });

    describe("statistic test", () => {
        for (let randomMode = 1; randomMode < 4; randomMode++) {
            it("should return expected", () => {
                gameData.gameConfigs = {
                    randomMode: randomMode,
                } as GameConfigs;

                const expectedProbabilities = {
                    over: 49.6,
                    under: 48.3,
                    odd: 49.6,
                    even: 48.3,
                };

                const statistic = {
                    over: 0,
                    under: 0,
                    odd: 0,
                    even: 0,
                };

                const draw1 = { ...statistic };
                const draw2 = { ...statistic };
                const draw3 = { ...statistic };
                const draw4 = { ...statistic };
                const draw5 = { ...statistic };
                const draw6 = { ...statistic };
                const draw7 = { ...statistic };
                const draw8 = { ...statistic };

                function getDraw(draw: number): any {
                    switch (draw) {
                        case 1:
                            return draw1;
                        case 2:
                            return draw2;
                        case 3:
                            return draw3;
                        case 4:
                            return draw4;
                        case 5:
                            return draw5;
                        case 6:
                            return draw6;
                        case 7:
                            return draw7;
                        case 8:
                            return draw8;
                    }
                    return {};
                }

                for (let turn = 1; turn <= numberOfTurnsToRun; turn++) {
                    const numberOfClients = chance.integer({ min: 0, max: 20 });
                    let mergeClientSeed = "";
                    for (let i = 0; i < numberOfClients; i++) {
                        mergeClientSeed += generateSeed();
                    }

                    const serverSeed = consumer.generateServerSeed();

                    const mergeSeed = serverSeed + mergeClientSeed;
                    const finalHash = SeedHelper.getSHA512Hash(mergeSeed);

                    const result = Helpers.generateResult({ finalHash, serverSeed });
                    const settlementResult = Helpers.getSettlementResult(result as DrawResult);

                    const currentDraw = getDraw(turn % gameSettings.numberOfTurnsPerRound || gameSettings.numberOfTurnsPerRound);

                    if (settlementResult.over) {
                        currentDraw.over++;
                        statistic.over++;
                    } else if (settlementResult.under) {
                        currentDraw.under++;
                        statistic.under++;
                    }

                    if (settlementResult.odd) {
                        currentDraw.odd++;
                        statistic.odd++;
                    } else if (settlementResult.even) {
                        currentDraw.even++;
                        statistic.even++;
                    }

                    gameData.roundResult.push(result);

                    if (turn % gameSettings.numberOfTurnsPerRound === 0) {
                        gameData.roundResult = [];
                    }
                }

                const probabilities = {
                    over: (statistic.over / numberOfTurnsToRun) * 100,
                    under: (statistic.under / numberOfTurnsToRun) * 100,
                    odd: (statistic.odd / numberOfTurnsToRun) * 100,
                    even: (statistic.even / numberOfTurnsToRun) * 100,
                };

                for (let i = 1; i <= gameSettings.numberOfTurnsPerRound; i++) {
                    const draw = getDraw(i);
                    const probabilitiesDraw = {
                        over: ((draw.over * gameSettings.numberOfTurnsPerRound) / numberOfTurnsToRun) * 100,
                        under: ((draw.under * gameSettings.numberOfTurnsPerRound) / numberOfTurnsToRun) * 100,
                        odd: ((draw.odd * gameSettings.numberOfTurnsPerRound) / numberOfTurnsToRun) * 100,
                        even: ((draw.even * gameSettings.numberOfTurnsPerRound) / numberOfTurnsToRun) * 100,
                    };

                    expect(probabilitiesDraw.over).toBeGreaterThanOrEqual(expectedProbabilities.over);
                    expect(probabilitiesDraw.under).toBeGreaterThanOrEqual(expectedProbabilities.under);
                    expect(probabilitiesDraw.odd).toBeGreaterThanOrEqual(expectedProbabilities.odd);
                    expect(probabilitiesDraw.even).toBeGreaterThanOrEqual(expectedProbabilities.even);
                }

                expect(probabilities.over).toBeGreaterThanOrEqual(expectedProbabilities.over);
                expect(probabilities.under).toBeGreaterThanOrEqual(expectedProbabilities.under);
                expect(probabilities.odd).toBeGreaterThanOrEqual(expectedProbabilities.odd);
                expect(probabilities.even).toBeGreaterThanOrEqual(expectedProbabilities.even);
            });
        }
    });
});
