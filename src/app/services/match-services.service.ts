import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CardDTO } from '../Models/CardDTO';
import { CardServiceService } from './card-service.service';

@Injectable({
  providedIn: 'root'
})

export class MatchServicesService {

  cardList : CardDTO[] = [];

  constructor(public http : HttpClient, public cardService : CardServiceService) { }

    async joinMatch()
    {
      let x  = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/JoinMatch", null));
      console.log(x);
      localStorage.setItem("match", x);
      return x;
    }

    async startMatch(matchId : number)
    {
      let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/StartMatch/" + matchId, null));
      console.log(x);

      this.cardList = await this.cardService.getdeck();
      
    }

}
