import { Component, OnInit } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(public service : MatchServicesService, public route : ActivatedRoute) { }

  mycards:any = [];
  enemycards:any = [];
  userBId : string = "";
  currentUserId : string = "";
  matchId : number = 0;
  playerId : number = 0;

  ngOnInit() {
    let card = {
      name: "Jedi Chat",
      attack: 2,
      defense: 10,
      imageUrl:"https://images.squarespace-cdn.com/content/51b3dc8ee4b051b96ceb10de/1394662654865-JKOZ7ZFF39247VYDTGG9/hilarious-jedi-cats-fight-video-preview.jpg?content-type=image%2Fjpeg"
    };
    for(let i=0; i<4; i++) {
      this.mycards.push(card);
      this.enemycards.push(card);
    }

    this.route.paramMap.subscribe(params => {
        this.matchId = Number(params.get('matchid'));
    });

    this.route.paramMap.subscribe(params => {
      this.playerId = Number(params.get('playerid'));
  });

    this.route.paramMap.subscribe(params => {
      this.userBId = params.get('userid')!;
  });

  this.currentUserId = localStorage.getItem("userId")!;

  console.log(this.playerId);

  this.startMatch();

  }

  async startMatch(){
    if(this.currentUserId == this.userBId){
          await this.service.startMatch(this.matchId);
    }
  }

}
