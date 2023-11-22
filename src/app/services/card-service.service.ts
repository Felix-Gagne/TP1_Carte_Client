import { CardDTO } from './../Models/CardDTO';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventoryOwnedCards } from '../Models/inventoryCards';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  AllCards : InventoryOwnedCards[] = [];
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

  async getdeck()
  {
    let options = { withCredentials : true }

    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetPlayerDeck"));
    console.log(x);
    this.cardList = x;
    console.log(this.cardList)
    return this.cardList;
  }

  async getInventory(){
    let x = await lastValueFrom(this.http.get<InventoryOwnedCards[]>(environment.apiUrl  +"api/Deck/GetInventory"));
    console.log('inventaire du joueur en dessous');
    console.log(x);
    
    this.AllCards = x;    
    console.log('En dessous c est la liste de carte que nous avons remplie');
    console.log(this.AllCards);
    return this.AllCards;
  }

  async getFilteredCards(filtrechoisi : string){
    console.log(filtrechoisi);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filtrechoisi",filtrechoisi);

    let x = await lastValueFrom(this.http.get<InventoryOwnedCards[]>(environment.apiUrl  +"api/Deck/GetFilteredCards", {params: queryParams}));
    console.log(x);

    this.AllCards = x;
    return this.AllCards;
  }
}
