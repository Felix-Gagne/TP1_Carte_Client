interface Card {
    id: number;
    name: string;
    attack: number;
    defense: number;
    imageUrl: string;
}

interface PlayerData {
    id: number;
    health: number;
    playerId: number;
    cardsPile: {
        id: number;
        card: Card;
        health: number;
        attack: number;
    }[];
    hand: {
        id: number;
        card: Card;
        health: number;
        attack: number;
    }[];
    battleField: Card[]; // Define a proper type for the battlefield if needed
    graveyard: Card[];   // Define a proper type for the graveyard if needed
}

interface SerializedEvent {
    id: number;
    index: number;
    serializedEvent: string;
}

interface Match {
    id: number;
    isPlayerATurn: boolean;
    eventIndex: number;
    isMatchCompleted: boolean;
    winnerUserId: string | null;
    userAId: string;
    userBId: string;
    playerDataA: PlayerData;
    playerDataB: PlayerData;
    serializedEvents: SerializedEvent[];
}

interface Player {
    id: number;
    name: string;
    money: number;
    identityUserId: string;
    deckCard: Card[];
}

interface GameData {
    match: Match;
    playerA: Player;
    playerB: Player;
}
