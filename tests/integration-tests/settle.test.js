import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import gameSettings from "./_stubs/game-settings";
import { startService } from "./_stubs/test-jobs";
import { getProcessId, buildConfigs, getTimeOutToPlacingBetTime, initUserSession, checkConnect } from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = { botenabled: false };
startService(processId, overrideGameConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when settle", () => {
    it("check connect", (done) => {
        checkConnect(processId, appConfigs, socketOptions, done);
    });

    describe("test data settle", () => {
        let client;

        beforeEach(async () => {
            client = new GameClientDriver(socketOptions, initUserSession(normalUser));

            const sendSignInInterval = setInterval(() => {
                client.sendSignInEvent();
            }, 500);

            await client.handleSignedInEvent();

            client.sendInGameEvent();

            clearInterval(sendSignInInterval);
        });

        afterEach(() => {
            client.close();
            client = null;
        });

        it("should return settled status data", async () => {
            // Arrange
            const inGameData = await client.handleGameEvent((data) => data.remainingTime);
            setTimeout(() => {
                client.emit(eventTypes.bet, { betChoices: { over: 10, odd: 20 }, clientSeed: "1234" });
            }, getTimeOutToPlacingBetTime(inGameData.remainingTime, gameSettings.durations) * 1000);

            // Act
            const result = await client.handleGameEvent((data) => data.status);
            const { status } = result;

            console.log(status);
            // Assert
            expect(status.bet).toBeGreaterThanOrEqual(10);
        }, 50000);
    });
});
