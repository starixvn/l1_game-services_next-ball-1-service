import { GameData, GameDefinition } from "sc-number-game-base";
import { Core } from "sc-game-base";
import { initAPIStub, stubUserService, subGameManagementService } from "sc-game-service-integration-utils";
import NextBallContainerRegistry from "../../../build/next-ball-container-registry";

import gameSettings from "./game-settings";
import { resultHelper } from "../../../build/helpers";
import { buildConfigs } from "./helper";

export const run = async (processId, overrideAppConfigs) => {
    const appConfigs = Object.assign({}, buildConfigs(processId), overrideAppConfigs);
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const definition = new GameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash,
        resultHelper.getProbabilities
    );
    const gameData = new GameData(gameSettings.durations.wholeRound);
    stubUserService(appConfigs);
    subGameManagementService(appConfigs, definition);
    const container = new NextBallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
};

const processId = process.argv[3];
const overrideAppConfigs = JSON.parse(process.argv[4]);
run(processId, overrideAppConfigs);
