import { EventPublishers } from "sc-number-game-base";
import { calculateOddsRange } from "../helpers";

export default class GameStatusPublisher extends EventPublishers.GameStatusPublisher {
    getOddsRange(margin?: Record<string, number>[]): any {
        return calculateOddsRange(margin);
    }
}
