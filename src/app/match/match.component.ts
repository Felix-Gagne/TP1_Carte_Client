import { Component, OnInit, } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardServiceService } from '../services/card-service.service';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { JsonPipe } from '@angular/common';
import { CardDTO } from '../Models/CardDTO';
import { timer } from 'rxjs';


@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  constructor(public service : MatchServicesService,public serviceCard : CardServiceService, public route : ActivatedRoute, public router : Router) { }

  

  //Boolean pour activer les animations des events
  


  async ngOnInit() {

    this.service.match = JSON.parse(localStorage.getItem("match") || '{}');

    this.route.paramMap.subscribe(params => {
      this.service.playerId = Number(params.get('playerid'));
  });

    this.route.paramMap.subscribe(params => {
      const result = params.get('result');
  });

  if(this.service.playerId == this.service.playerA.id){
    this.service.currentName = this.service.playerA.name;
    this.service.enemyName = this.service.playerB.name;
  }else{
    this.service.currentName = this.service.playerB.name;
    this.service.enemyName = this.service.playerA.name;
  }

  this.service.currentUserId = localStorage.getItem("userId")!;
  console.log(this.service.playerId);
  console.log(this.service.match);
  await this.service.startMatch();
  this.service.updateMatch();
}
  


  async getCards(){
    this.service.match.playerDataA.cardsPile.forEach((card : any) => {
      this.serviceCard.playableCards.push(card);
    });
    this.service.match.playerDataB.cardsPile.forEach((card : any) => {
      this.serviceCard.playableCards.push(card);
    });
    console.log("getting cards");
    console.log(this.serviceCard.playableCards);
    await this.serviceCard.getdeck();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}