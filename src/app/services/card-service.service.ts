import { CardDTO } from './../Models/CardDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryOwnedCards } from '../Models/inventoryCards';
import { Deck } from '../Models/Deck';
import { DeckDTO } from '../Models/DeckDTO';
import { EditDeckDTO } from '../Models/EditDeckDTO';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  AllCards : CardDTO[] = [];
  Inventory : InventoryOwnedCards[] = [];
  decks : Deck[] = [];
  cardList : CardDTO[] = [];
  playableCards : any[] = [];

  currentHand : any[] = [];
  enemyHand :any[] = [];
  currentPile : any[] = [];
  enemyPile : any[] = [];
  currentBattlefield : any[] = [];
  enemyBattlefield : any[] = [];
  currentGravetard : any[] = [];
  enemyGraveYard : any[] = [];

  clickedCard : any;

  animateCardId : number = 0;

constructor(public http : HttpClient) { }

async GetAllCards(){
  let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl+'api/Deck/GetAllCards'));
  console.log(x);
  this.AllCards = x;
  return x;
}

  async newDeck(nameInput : string, cardsInput : number[]){ 
    let deck = new DeckDTO(
      nameInput,
      cardsInput
    );

    let x = await lastValueFrom(this.http.post<DeckDTO>(environment.apiUrl+'api/Deck/CreateDeck', deck));
    console.log("New deck:");
    console.log(x);
  }

  async editDeck(name : string, cardsInput : InventoryOwnedCards[], id : number){
    let editDeck = new EditDeckDTO(
      name,
      cardsInput
    );

    let x = await lastValueFrom(this.http.put<EditDeckDTO>(environment.apiUrl+'api/Deck/EditDeck/' + id, editDeck));
    console.log("Edit deck:");
    console.log(x);
  }

  async getDecks()
  {
    let options = { withCredentials : true }

    let x = await lastValueFrom(this.http.get<Deck[]>(environment.apiUrl  +"api/Deck/GetDecks"));
    console.log("Get decks:");
    console.log(x);
    this.decks = x;
    return x;
  }

  async getInventory(){
    let x = await lastValueFrom(this.http.get<InventoryOwnedCards[]>(environment.apiUrl  +"api/Deck/GetInventory"));
    console.log('inventaire du joueur en dessous');
    console.log(x);
    
    this.Inventory = x;    
    console.log('En dessous c est la liste de carte que nous avons remplie');
    console.log(this.Inventory);
    return this.Inventory;
  }

  async deleteDeck(deckId : number){
    let x = await lastValueFrom(this.http.delete<number>(environment.apiUrl + "api/Deck/DeleteDeck/" + deckId))
    console.log(x);
  }

  async getFilteredCards(filtrechoisi : string){
    console.log(filtrechoisi);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filtrechoisi",filtrechoisi);

    let x = await lastValueFrom(this.http.get<InventoryOwnedCards[]>(environment.apiUrl  +"api/Deck/GetFilteredCards", {params: queryParams}));
    console.log(x);

    this.Inventory = x;
    return this.Inventory;
  }
}
