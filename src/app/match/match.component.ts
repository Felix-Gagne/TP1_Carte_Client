import { Component, OnInit, } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardServiceService } from '../services/card-service.service';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { JsonPipe } from '@angular/common';
import { CardDTO } from '../Models/CardDTO';
import { timer } from 'rxjs';

const match = JSON.parse(localStorage.getItem("match") || '{}');

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  constructor(public service : MatchServicesService,public serviceCard : CardServiceService, public route : ActivatedRoute, public router : Router) { }

  myHand:any = [];
  enemycards:any = [];
  currentUserId : string = "";
  playerId : any = 0;
  currentName:string = "";
  enemyName:string = "";

  //Boolean pour activer les animations des events
  isCurrentTurn:boolean = false;
  matchStartAnim:boolean = false;
  _drawCard:boolean = false;
  playingCard:boolean = false;
  cardAttack:boolean = false;
  cardDeath:boolean = false;
  playerDamage:boolean = false;
  playerDeath:boolean = false


  ngOnInit() {

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
      await this.processEvents(JSON.parse(result));
      this.updateTurn();
      this.updateMatch();
    }else{
      console.log("updating...")
      setTimeout(() => {
        this.updateMatch();
      }, 500);
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
      let cardId = this.serviceCard.cardList.find((card : any) => card.name === cardName);
      console.log("card depuis match: " + cardName);
      console.log("card id: " + cardId?.id);

      if(cardId != undefined){
        let result = await this.service.playCard(match.match.id, cardId?.id);
      }

    }
  }

  async getCards(){
    match.match.playerDataA.cardsPile.forEach((card : any) => {
      this.serviceCard.playableCards.push(card);
    });
    match.match.playerDataB.cardsPile.forEach((card : any) => {
      this.serviceCard.playableCards.push(card);
    });
    console.log("getting cards");
    console.log(this.serviceCard.playableCards);
    await this.serviceCard.getdeck();
    this.myHand = this.serviceCard.cardHand;
  }

  toggleAnim() {
    this.matchStartAnim = !this.matchStartAnim
  }

  async processEvents(event : any){
    if(event.$type == "StartMatch"){
      console.log("Event: StartMatch");
      await this.StartMatch();
      match.match.eventIndex = 1;
    }
    if(event.$type == "DrawCard"){
      console.log("Event: DrawCard id " + event.PlayableCardId + " for player " + event.PlayerId);
      if(event.PlayerId == this.playerId){
        await this.DrawCardCurrent(event.PlayableCardId);
        
      }else{
        await this.DrawCardenemy(event.PlayableCardId);
      }
    }
    if(event.$type == "PlayCard"){
      console.log("playcard");
    }
    if(event.$type =="PlayerTurn"){
      if(event.PlayerId == this.playerId.id){
        this.isCurrentTurn = true;
        match.match.isPlayerATurn = false;
      }else{
        this.isCurrentTurn = false;
        match.match.isPlayerATurn = true;
      }
    }
    if(event.Events != null){
      event.Events.forEach(async (event : any) => {
        await this.processEvents(event);
      });
    }
  }

  async StartMatch(){
    this.matchStartAnim = true;
    setTimeout(() => {
      this.matchStartAnim = false;
    }, 3000);
  }

  DrawCardCurrent(cardId : number){
    var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
    console.log(card);
    this.serviceCard.cardHand.push(card!.card);
    this.serviceCard.animateCardId = cardId;
    console.log(this.serviceCard.animateCardId);
  }

  async DrawCardenemy(cardId : number){
    var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
    console.log(card);
    this.enemycards.push(card);
    this._drawCard = true;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}