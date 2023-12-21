import { Rarity } from "./CardDTO";

export class Pack{
    constructor(
        public id : number,
        public name : string,
        public price : number,
        public imageURL : string,
        public nbCards : number,
        public baseRarity : Rarity){}
}