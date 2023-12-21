import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deck } from '../Models/Deck';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { StatsDTO } from '../Models/StatsDTO';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  decks : Deck[] = [];

  stats? : StatsDTO;

  constructor(public http : HttpClient) { }

  async GetGeneralStats(){

    let x = await lastValueFrom(this.http.get<StatsDTO>(environment.apiUrl + 'api/Stats/GetGeneralStats'));

    console.log(x);

    this.stats = x;

    return this.stats;
  }
}
