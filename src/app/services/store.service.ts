import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreCards } from '../Models/StoreCards';
import { Pack } from '../Models/Pack';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeCardsList : StoreCards[] = [];
  packs : Pack[] = [];

  constructor(public http : HttpClient) { }

  async getBuyableCards(){

    this.storeCardsList = [];
    let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+'api/Store/GetBuyableCards'));
    console.log(x);
    for(let a in x){
      //console.log(a.);
      console.log(x[a].card);
      const card = new StoreCards(x[a].id, x[a].buyAmount, x[a].card,x[a].sellAmount);
      this.storeCardsList.push(card);
    }
    console.log(this.storeCardsList);
    return this.storeCardsList;

  }

  async buyCards(cardId:number){

    const requestBody = {
      cardId: cardId
    };
    let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+'api/Store/BuyCard/' + cardId, null));
    console.log(x);
  }

  async sellCard(cardId:number){

    const requestBody = {
      cardId: cardId,
    };
    let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+'api/Store/SellCard/' + cardId, null));
    console.log(x);
  }

  async GetPacks(){
    this.packs = [];
    let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+'api/Store/GetPacks'));
    console.log(x);
    this.packs = x;
    return this.packs;

  }

  async BuyPack(packId : number){
    let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+'api/Store/BuyPack/' + packId, null));
    console.log(x);
    return x;
  }
}
