import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreCards } from '../Models/StoreCards';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeCardsList : StoreCards[] = [];
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
}
