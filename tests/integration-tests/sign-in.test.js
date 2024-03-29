import { startService } from "./_stubs/test-jobs";
const path = require("path");
import { getProcessId, buildConfigs, initUserSession, checkConnect } from "./_stubs/helper";
import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import { socketOptionsFunc } from "./_stubs/test-data";

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = { botenabled: false };
startService(processId, overrideGameConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("signin", () => {
    it("check connect", (done) => {
        checkConnect(processId, appConfigs, socketOptions, done);
    });

    it("should receive signed in response", async () => {
        //Arrange & Act
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));

        const sendSignInInterval =  setInterval(() => {
            client.sendSignInEvent();
        }, 500);

        // Act
        await client.handleSignedInEvent();

        clearInterval(sendSignInInterval);
        
        client.close();
    }, 5000);
});
