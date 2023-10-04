import { Component, OnInit, } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardServiceService } from '../services/card-service.service';

const match = JSON.parse(localStorage.getItem("match") || '{}');

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  constructor(public service : MatchServicesService,public serviceCard : CardServiceService, public route : ActivatedRoute, public router : Router) { }

  mycards:any = [];
  enemycards:any = [];
  currentUserId : string = "";
  playerId : any = 0;
  currentName:string = "";
  enemyName:string = "";

  //Boolean pour activer les animations des events
  isCurrentTurn:boolean = false;
  pickCard:boolean = false;
  playingCard:boolean = false;
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
  this.updateTurn();
  this.startMatch();
  this.getCards();
  this.updateMatch();
  
}

  async startMatch(){
    if(this.currentUserId == match.match.userBId){
          await this.service.startMatch(match.match.id);
    }
  }

  async updateMatch(){
    var result;
    if(match.match.id != undefined){
      result = await this.service.updateMatch(match.match.id, match.match.eventIndex);
    } 
    if(result != null){
      this.updateTurn();
    }else{
      console.log("updating...")
      setTimeout(() => {
        //this.updateMatch();
      }, 3000);
    }
  }


  async endMatch(){
    await this.service.endMatch(match.match.id);
    this.router.navigate(['/home']);
  }

  updateTurn(){
    if(match.match.isPlayerATurn && (this.playerId == match.playerA.id)){
      this.isCurrentTurn = true;
      console.log("its my turn");
    }else if(this.playerId == match.playerB.id){
      this.isCurrentTurn = true;
      console.log("its my turn");
    }
  }
  async playCard(){
    if(this.isCurrentTurn){
      this.playingCard = true;
      var cardName = await this.serviceCard.clickedCard;
      let cardId = this.mycards.find((card : any) => card.name === cardName);
      console.log("card depuis match: " + cardName);
      console.log("card id: " + cardId.id);
    }
  }

  async getCards(){
    console.log("getting cards");
    this.mycards = await this.serviceCard.getdeck();
  }

  toggleTurn() {
    this.isCurrentTurn = !this.isCurrentTurn;
  }
}