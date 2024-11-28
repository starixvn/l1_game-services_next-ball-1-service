
import { EventConsumers, GameData, GameDefinition } from "sc-number-game-base";
import RoundResultPublisher from "../event-publishers/round-result-pulisher";
import { FinishDraw } from "sc-number-game-base/dist/event-consumers/settle-game-round-consumer";

export class SettleGameRoundConsumer extends EventConsumers.SettleGameRoundConsumer {
    declare gameData: GameData;
    declare definition: GameDefinition;
    declare roundResultPublisher: RoundResultPublisher;

    override async settleRound() {
        let roundSettled: any;
        const drawResult = this.gameData.result;
        const drawSettlementResult = this.definition.settle(drawResult);
        const { roundId, drawId, exchangeRates } = this.gameData;
        Object.assign(drawResult, { drawId: drawId, time: new Date() });
        Object.assign(drawSettlementResult, { drawId: drawId });

        if (this.isFirstDrawOfRound(drawId)) {
            roundSettled = await this.roundsRepository.create({
                id: roundId,
                drawId: drawId,
                result: [drawResult],
                settlementResult: [drawSettlementResult],
                time: new Date(),
                exchangeRateId: exchangeRates.exId,
                ended: false,
            });
        } else {
            const filter = { id: roundId };
            const update = { $push: { result: drawResult, settlementResult: drawSettlementResult }, $set: { drawId: drawId } };

            if (this.isLastDrawOfRound(drawId)) {
                update.$set = { ...update.$set, ...{ ended: true } };
            }

            const opts = { new: true };
            roundSettled = await this.roundsRepository.findOneAndUpdate(filter, update, opts);
        }

        if (roundSettled) {
            const finishDraw: FinishDraw = {
                result: drawResult,
                settlementResult: drawSettlementResult,
                roundId: roundSettled.id,
                drawId: roundSettled.drawId,
                time: drawResult.time,
                isLastDraw: roundSettled.ended,

            };
            this.roundResultPublisher.publishRoundResult(finishDraw);
            this.updateRoundData(finishDraw, roundSettled.result);
            await this.settleBets(finishDraw);
            this.roundResultPublisher.publishWinners(roundId, this.gameData.winningPlayers, drawId);
        }
    }
}
