import { EventPublishers } from "sc-number-game-base";

export default class RoundResultPublisher extends EventPublishers.RoundResultPublisher {
    publishRoundResult(roundResult: any, gameData?: any) {
        const socketPlayers = Object.values(gameData?.realPlayers).map((player: any) => player?.socketClient);

        const payload = { finish: roundResult, socketPlayers };

        if (this.gameData.pf) {
            payload.finish.pf = this.getHashedResult();
        }

        this.publishToAllUsers(payload);
        this.publishToAllAdmins(payload);
    }
}
