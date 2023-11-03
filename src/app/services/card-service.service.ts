import { CardDTO } from './../Models/CardDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  AllCards : CardDTO[] = [];
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


  fakeCardList : any[] = [
    new CardDTO(1, "carte 1", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(2, "carte 2", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(3, "carte 3", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(4, "carte 4", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(5, "carte 5", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(6, "carte 6", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(7, "carte 7", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(8, "carte 8", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(9, "carte 9", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
    new CardDTO(10, "carte 10", 3, 4, "https://upload.wikimedia.org/wikipedia/commons/3/35/Basic_human_drawing.png"),
  ];

  clickedCard : any;

  animateCardId : number = 0;

constructor(public http : HttpClient) { }

  async getdeck()
  {
    let options = { withCredentials : true }

    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetPlayerDeck"));
    console.log(x);
    this.cardList = x;
    console.log(this.currentHand);
    return this.cardList;
  }

  async getAllCards(){
    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetAllCards"));
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
