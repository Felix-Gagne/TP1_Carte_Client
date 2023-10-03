import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CardDTO } from '../Models/CardDTO';
import { CardServiceService } from './card-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class MatchServicesService {

  cardList : CardDTO[] = [];

  constructor(public http : HttpClient, public cardService : CardServiceService) { }

    async joinMatch()
    {
      let x  = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/JoinMatch", null));
      console.log("Join Match :" + x);
      localStorage.setItem("match", JSON.stringify(x));
      return x;
    }

    async startMatch(matchId : number)
    {
      let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/StartMatch/" + matchId, null));
      console.log("Start Match :" + x);

      //this.EventIndexChanged();
      this.cardList = await this.cardService.getdeck();
      
    }

    async updateMatch(matchId : number, eventIndex : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/UpdateMatch/" + matchId + "/" + eventIndex));
      console.log("Update Match :" + x);
    }

    EventIndexChanged(){
      let newMatch = JSON.parse(localStorage.getItem("match") || '{}');
      newMatch.eventIndex++;
      localStorage.removeItem("match");
      console.log("New event index:" + newMatch.eventIndex)
      localStorage.setItem("match", JSON.stringify(newMatch));
    }


    async endMatch(matchId : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/EndMatch/" + matchId));
      console.log(x);
    }

}
