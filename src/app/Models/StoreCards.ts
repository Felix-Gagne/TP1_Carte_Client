import { CardDTO } from "./CardDTO";

export class StoreCards{
    constructor(
        public id : number,
        public buyAmount : number,
        public card : CardDTO, 
        public sellAmount : number){}
}