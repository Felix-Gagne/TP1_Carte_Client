export class CardDTO{
    constructor(
        public id : number,
        public name : string,
        public attack : number,
        public defense : number,
        public prixVente : number,
        public imageUrl : string){}
}