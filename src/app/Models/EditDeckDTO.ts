import { InventoryOwnedCards } from "./inventoryCards";

export class EditDeckDTO{
    constructor(
        public name : string,
        public Cards : InventoryOwnedCards[]){}
}