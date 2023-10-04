import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MatchServicesService {


  constructor(public http : HttpClient) { }

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

    }

    async updateMatch(matchId : number, eventIndex : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/UpdateMatch/" + matchId + "/" + eventIndex));
      console.log("Update Match :" + x);
      return x;
    }


    async endMatch(matchId : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/EndMatch/" + matchId));
      console.log(x);
    }

}
