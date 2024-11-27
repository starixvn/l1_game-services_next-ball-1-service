import { EventPublishers } from "sc-number-game-base";

export default class RoundResultPublisher extends EventPublishers.RoundResultPublisher {
    publishRoundResult(roundResult: any) {
        // const socketPlayers = Object.values(this.gameData?.realPlayers).map((player: any) => player?.socketClient);

        const payload = { finish: roundResult };

        if (this.gameData.pf) {
            payload.finish.pf = this.getHashedResult();
        }

        this.publishToAllUsers(payload);
        this.publishToAllAdmins(payload);
    }
}
