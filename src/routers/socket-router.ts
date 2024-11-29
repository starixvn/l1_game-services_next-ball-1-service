
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { InGameConsumer, PlaceBetConsumer, UserDisconnectConsumer, UserSignInConsumer } from "sc-game-base/src/core/event-consumers";
import { UserSignInPublisher } from "sc-game-base/src/core/event-publishers";
import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";
import { SocketRouter as BaseSocketRouter } from "sc-number-game-base/dist/routers";
import { UserRateLimiter } from "sc-number-game-base/dist/rate-limiters";
import RoundQuery from "sc-number-game-base/dist/query-apis/round-query";
import GameDefinition from "sc-number-game-base/dist/game-definition";
import { GameData } from "sc-number-game-base";
import { HistoryQuery } from "sc-number-game-base/dist/query-apis";
import { logger } from "sc-common";

export default class SocketRouter extends BaseSocketRouter {
    declare gameData: GameData;
    declare definition: GameDefinition;
    declare roundQuery: RoundQuery;
    userRateLimiter: UserRateLimiter;

    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        playGamePermissionValidator,
        roundQuery,
        userRateLimiter,
    }: {
        definition: GameDefinition;
        gameData: GameData;
        userSignInConsumer: UserSignInConsumer;
        inGameConsumer: InGameConsumer;
        placeBetConsumer: PlaceBetConsumer;
        userDisconnectConsumer: UserDisconnectConsumer;
        userSignInPublisher: UserSignInPublisher;
        historyQuery: HistoryQuery;
        logService: typeof logger;
        playGamePermissionValidator: PlayGamePermissionValidator;
        roundQuery: RoundQuery;
        userRateLimiter: UserRateLimiter;
    }) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            inGameConsumer,
            placeBetConsumer,
            userDisconnectConsumer,
            userSignInPublisher,
            historyQuery,
            logService,
            playGamePermissionValidator,
            roundQuery,
            userRateLimiter,
        });

        this.userRateLimiter = userRateLimiter;
    }

    init(socketClient: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        super.init(socketClient);

        this.socketClient.on("custom_ping", (timestamp) => {
            this.socketClient.emit("custom_pong", timestamp);
        });

        const healthCheckInterval = setInterval(() => {
            this.socketClient.emit('health-check', 'Are you alive?', (response: any) => {
                if (response !== 'yes') {
                    this.socketClient.emit(`Client ${this.socketClient.id} did not respond properly`);
                }
            });
        }, 3000);

        this.socketClient.on('disconnect', () => {
            this.socketClient.emit(`Client disconnected: ${this.socketClient.id}`);
            clearInterval(healthCheckInterval);
        });
    }
}
