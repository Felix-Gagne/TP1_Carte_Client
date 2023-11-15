import { CardDTO } from './../Models/CardDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Deck } from '../Models/Deck';
import { DeckDTO } from '../Models/DeckDTO';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  AllCards : CardDTO[] = [];
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


  async newDeck(nameInput : string, cardsInput : number[]){ 
    let deck = new DeckDTO(
      nameInput,
      cardsInput
    );

    let x = await lastValueFrom(this.http.post<DeckDTO>(environment.apiUrl+'api/Deck/CreateDeck', deck));
    console.log(x);
  }

  async getDecks()
  {
    let options = { withCredentials : true }

    let x = await lastValueFrom(this.http.get<Deck[]>(environment.apiUrl  +"api/Deck/GetDecks"));
    console.log(x);
    this.decks = x;
    console.log(this.currentHand);
    return this.decks;
  }

  async deleteDeck(deckId : number){
    let x = await lastValueFrom(this.http.delete<number>(environment.apiUrl + "api/Deck/DeleteDeck/" + deckId))
    console.log(x);
  }

  async getAllCards(){
    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetInventory"));
    console.log(x);

    this.AllCards = x;
    return this.AllCards;
  }

  async getFilteredCards(filtrechoisi : string){
    console.log(filtrechoisi);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filtrechoisi",filtrechoisi);

    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetFilteredCards", {params: queryParams}));
    console.log(x);

    this.AllCards = x;
    return this.AllCards;
  }
}
