import { CardDTO } from "./CardDTO";

export class StatsDTO{
    constructor(
        public wins : number,
        public loses : number,
        public cards : CardDTO[]){}
}