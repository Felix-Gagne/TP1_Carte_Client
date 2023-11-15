import { CardDTO } from "./CardDTO";

export class Deck{
    constructor(
        public cards : any[],
        public id : number,
        public name : string,
        public playerId : number){}
}