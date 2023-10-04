import { CardDTO } from './../Models/CardDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  cardList : CardDTO[] = [];
  cardHand : CardDTO[] = [];
  battlefield : CardDTO[] = [];
  graveyard : CardDTO[] = [];
  clickedCard : any;

constructor(public http : HttpClient) { }

async getdeck()
  {

    let options = { withCredentials : true }

    let x = await lastValueFrom(this.http.get<CardDTO[]>(environment.apiUrl  +"api/Deck/GetPlayerDeck"));
    console.log(x);
    this.cardHand = x.slice(0,4);
    this.cardList = x;
    return this.cardList;
  }
}
