import { calculateOddsRange } from "../../../src/helpers/calculate-odds-range";
import { Helpers } from "sc-number-game-base";

jest.mock("sc-number-game-base", () => ({
    Helpers: { getBetOdds: jest.fn() },
}));

describe("calculateOddsRange tests", () => {
    it("should call Helpers.getBetOdds", () => {
        // arrange
        const MinProbability = {
            over: 30 / 67,
            under: 29 / 67,
            odd: 30 / 67,
            even: 29 / 67,
        };

        const MaxProbability = {
            over: 38 / 67,
            under: 37 / 67,
            odd: 38 / 67,
            even: 37 / 67,
        };

        const margin = [
            {
                over: 0.05,
                under: 0.05,
                odd: 0.05,
                even: 0.05,
                max: 10,
            },
            {
                over: 0.05,
                under: 0.05,
                odd: 0.05,
                even: 0.05,
                max: 100,
            },
        ];

        // act
        calculateOddsRange(margin);

        // assert
        expect(Helpers.getBetOdds).toHaveBeenNthCalledWith(1, MaxProbability, margin);
        expect(Helpers.getBetOdds).toHaveBeenNthCalledWith(2, MinProbability, margin);
    });
});
