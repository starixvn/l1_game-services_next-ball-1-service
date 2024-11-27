import { asClass, asValue } from "awilix";
import { bets, rounds, tmpBets, betLogs, results } from "./models/index";
import { ContainerRegistry } from "sc-number-game-base";
import { InGameConsumer, RoundResultConsumer } from "./event-consumers";
import RunningRoundInfoPublisher from "./event-publishers/running-round-info-publisher";
import { GameStatusPublisher } from "./event-publishers";
import { SettleGameRoundConsumer } from "./event-consumers/settle-game-round-consumer";
import RoundResultPublisher from "./event-publishers/round-result-pulisher";

export default class NextBallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            betLogsRepository: asValue(betLogs),
            resultsRepository: asValue(results),
        });
    }

    registerConsumers(): void {
        super.registerConsumers();
        this.container.register({
            inGameConsumer: asClass(InGameConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
            roundResultConsumer: asClass(RoundResultConsumer).singleton(),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            runningRoundInfoPublisher: asClass(RunningRoundInfoPublisher).singleton(),
            gameStatusPublisher: asClass(GameStatusPublisher).singleton(),
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
        });
    }
}
