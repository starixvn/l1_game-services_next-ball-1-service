import { GameData, GameDefinition } from "sc-number-game-base";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import { Core } from "sc-game-base";
import NextBallContainerRegistry from "./next-ball-container-registry";

const run = async () => {
    const definition = new GameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash,
        resultHelper.getProbabilities
    );

    const gameData = new GameData(gameSettings.durations.wholeRound);

    const container = new NextBallContainerRegistry().register(appConfigs, definition, gameData);

    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);

    app.socketServer.on("custom_ping", (timestamp) => {
        app.socketServer.emit("custom_pong", timestamp);
    });

    app.socketServer.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        const healthCheckInterval = setInterval(() => {
            socket.emit('health-check', 'Are you alive?', (response: any) => {
                if (response !== 'yes') {
                    socket.emit(`Client ${socket.id} did not respond properly`);
                }
            });
        }, 10000);

        socket.on('disconnect', () => {
            socket.emit(`Client disconnected: ${socket.id}`);
            clearInterval(healthCheckInterval);
        });
    });

    await app.run();

    await app.startGame(container);
};

run();
