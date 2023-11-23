import { CardDTO } from "./CardDTO";

export class InventoryOwnedCards{
    constructor(
        public id : number,
        public cardId : number,
        public playerId: number,
        public card: CardDTO,
        ){}
}