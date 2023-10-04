import { Component, OnInit } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

const match = JSON.parse(localStorage.getItem("match") || '{}');

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(public service : MatchServicesService, public route : ActivatedRoute, public router : Router) { }

  mycards:any = [];
  enemycards:any = [];
  currentUserId : string = "";
  playerId : number = 0;
  currentName:string = "";
  enemyName:string = "";

  //Boolean pour activer les animations des events
  isCurrentTurn:boolean = true;
  pickCard:boolean = false;
  playCard:boolean = false;
  cardAttack:boolean = false;
  cardDeath:boolean = false;
  playerDamage:boolean = false;
  playerDeath:boolean = false


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
      this.playerId = Number(params.get('playerid'));
  });

    this.route.paramMap.subscribe(params => {
      const result = params.get('result');
  });

  if(this.playerId == match.playerA.id){
    this.currentName = match.playerA.name;
    this.enemyName = match.playerB.name;
  }else{
    this.currentName = match.playerB.name;
    this.enemyName = match.playerA.name;
  }

  this.currentUserId = localStorage.getItem("userId")!;

  console.log(this.playerId);
  console.log(match);

  this.startMatch();


  this.updateMatch();
  }

  async startMatch(){
    console.log("current:"+ this.currentUserId + "\nuserbid : " + match.match.userBId);
    console.log(this.currentUserId == match.match.userBId);
    if(this.currentUserId == match.match.userBId){
          await this.service.startMatch(match.match.id);
    }
  }

  async updateMatch(){
    if(match.match.id != undefined){
      await this.service.updateMatch(match.match.id, match.match.eventIndex);
    } 
  }


  async endMatch(){
    await this.service.endMatch(match.match.id);
    this.router.navigate(['/home']);
  }


  toggleTurn() {
    this.isCurrentTurn = !this.isCurrentTurn;
  }
}
