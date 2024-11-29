import { EventPublishers } from "sc-number-game-base";

export default class RoundResultPublisher extends EventPublishers.RoundResultPublisher {
    override publishRoundResult(roundResult: any) {

        const payload = { finish: roundResult };

        if (this.gameData.pf) {
            payload.finish.pf = this.getHashedResult();

        }

        const playerInfo = Object.values(this.gameData.realPlayers).map((realPlayer: any) => {
            return {
                username: realPlayer.profile?.name,
                userId: realPlayer.UID,
                playerId: realPlayer.session?.playerId,
                playerName: realPlayer.session?.playerName,
            }

        });

        this.publishToAllUsers(playerInfo);
        this.publishToAllUsers(payload);
        this.publishToAllAdmins(payload);
    }

    override publishToAllUsers(payload: any) {
        const socketPlayers = Object.values(this.gameData.realPlayers).map((player: any) => player.socketClient);
        const socketIds = Object.values(this.gameData.realPlayers).map((player: any) => player.socketClient.id);

        socketPlayers.forEach((socket) => {
            if (socket) {
                const playerSocketId = this.gameData.realPlayers[socket.id];
                socket.emit(this.gameName, payload);
                socket.emit(this.gameName, { playerSocketId, socketIds });
            }
        });
    }

}
