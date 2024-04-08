import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "../helper/helper";
import { socketOptionsFunc } from "../_stubs/test-data";
import appConfigs from "../../../build/app-configs.IGT";

const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when getPfInfo", () => {
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

    it("should return pfInfo", async () => {
        // Arrange
        client.emit("getPfInfo", { drawId: 2 });
        const pfInfo = {
            clientSeeds: [],
            roundId: 1,
            drawId: 2,
            serverSeedHash: "d75a7705621aba0320af2c5d0b6f534f48b9c90f3d8619b79b5b574990528d4e",
            serverSeed:
                '{"random":"3;16","remain":"1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:21:22:23:24:25:26:27:28:29:30:31:32:33:34:35:36:37:38:39:40:41:42:43:44:45:46:47:48:49:50:51:52:53:54:55:56:57:58:59:60:61:62:63:64:65:66:67:68:69:70:71:72:73:74;1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:21:22:23:24:25:26:27:28:29:30:31:32:33:34:35:36:37:38:39:40:41:42:43:44:45:46:47:48:49:50:51:52:53:54:55:57:58:59:60:61:62:63:64:65:66:67:68:69:70:71:72:73:74:75","secret":"Su4rMOrlI1rsZTCEbqpmejCGIDDPE5FU"}',
            encryptedServerSeed: {
                iv: "0a39e450c766b3a1f362cdc58229b2fb",
                content:
                    "2fff955b14affaf2f2e9c4b17c78e72a51af3132fa77ee2f7184f6c51d443f0c7e3bb1d7daae139d1608c0cb48929cc3d499db3641911e9c12c4e075f834fba8c224fef192d6e269840834ea0e3670f1210303cacdbb219424bbba3cf6a2afdd09142cfe2cf61c31e0bfa88ceb9c29e5dbbebb6f628992900d664c0345c5701d8bc61ced09ff3b2cfe807fac0471a6d9b8de66f241ae31845f86e00a195f6cd35dfd3d212acd05f87c3e021a9c50ee815c0952d91bcc7c4d24585e4dce795ab559a6c2cca5d328de03d72c243d1e9379d221be9811f0baa795872f2879076b578ef918d1a38d47e0a2cb39b4cd228d176630fc765abf95a9d18380862df0802dfe0af701e2d4d2fe66fde4e02522f1cd822619736587116b8ebba2d77a3c098f03c0b14cfa12cef68735dfc7076f8a4092285ed31189714c7c589afe04ab6ca456a35337912fc9ab4f066d332e561351137a6acacc48988175c0bc42674966c884921629bff3eaa7497a2fc0c35173cf18479cf436cc1bf97afb0e45b2117d422fa44b997d6567a1885def76d547c4e4ef5efe899ee53ed9381fc5e4b13bcdaeb8d930bef56a7a8f58a41eb58ca66939b65e37b0f7ee390042d38f1191b0b49f1433a986f0af1294bff024dbecddaa655822f42f37b6dc653a61355d65c44d62657d7cbd55991ad32873c1fd079453c4dae6",
            },
            finalHash:
                "50f62388850016c3c975464e983f4448d56c3e756e33b8deac97f88ca1ad5758ff56f5e0e300ad75dea6a16a54bc2489f634e869fb5945676e5b4e33f847cc88",
            mergeClientSeed: "",
            mergeSeed:
                '{"random":"3;16","remain":"1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:21:22:23:24:25:26:27:28:29:30:31:32:33:34:35:36:37:38:39:40:41:42:43:44:45:46:47:48:49:50:51:52:53:54:55:56:57:58:59:60:61:62:63:64:65:66:67:68:69:70:71:72:73:74;1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:20:21:22:23:24:25:26:27:28:29:30:31:32:33:34:35:36:37:38:39:40:41:42:43:44:45:46:47:48:49:50:51:52:53:54:55:57:58:59:60:61:62:63:64:65:66:67:68:69:70:71:72:73:74:75","secret":"Su4rMOrlI1rsZTCEbqpmejCGIDDPE5FU"}',
        };

        // Act
        const actual = await client.handleGameEvent((data) => data.clientSeedDetail);

        // Assert
        expect(actual.pfResult.serverSeedHash).toEqual(pfInfo.serverSeedHash);
        expect(JSON.stringify(actual.pfResult.serverSeed)).toEqual(JSON.stringify(pfInfo.serverSeed));
        expect(actual.clientSeedDetail).toEqual({});
    });
});
