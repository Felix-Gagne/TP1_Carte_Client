export class Card {
    constructor(
        public id: number,
        public name: string,
        public attack: number,
        public defense: number,
        public imageUrl: string
    ){}
    
}

export class PlayableCard {
    constructor(
        public id: number,
        public card: Card,
        public health: number,
        public attack: number
    ){}
}

export class PlayerData {
    constructor(
        public id: number,
        public health: number,
        public playerId: number,
        public cardsPile: PlayableCard[],
        public hand: PlayableCard[],
        public battleField: PlayableCard[],
        public graveyard: PlayableCard[]
    ){} 
}

export class SerializedEvent {
    constructor(
        public id: number,
        public index: number,
        public serializedEvent: string
    ){}
}

export class Match {
    constructor(
        public id: number,
        public isPlayerATurn: boolean,
        public eventIndex: number,
        public isMatchCompleted: boolean,
        public winnerUserId: string | null,
        public userAId: string,
        public userBId: string,
        public playerDataA: PlayerData,
        public playerDataB: PlayerData,
        public serializedEvents: SerializedEvent[],
    ){}
}

export class Player {
    constructor(
        public id: number,
        public name: string,
        public money: number,
        public identityUserId: string,
        public deckCard: Card[]
    ){}
}

export class GameData {
    constructor(
        public match: Match,
        public playerA: Player,
        public playerB: Player
    ){}
}
