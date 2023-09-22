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
      console.log(x);
      return x;
    }

}
