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

  currentUserId : string = "";
  playerId : any = 0;
  currentName:string = "";
  enemyName:string = "";
  cardDrew:number = 0;

  //Boolean pour activer les animations des events
  isCurrentTurn:boolean = false;
  matchStartAnim:boolean = false;
  _drawCard:boolean = false;
  playingCard:boolean = false;
  cardAttack:boolean = false;
  cardDeath:boolean = false;
  playerDamage:boolean = false;
  playerDeath:boolean = false


  async ngOnInit() {

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
  await this.startMatch();
  this.getCards();
  this.updateMatch();
}

  async startMatch(){
    if(this.currentUserId == match.match.userBId){
          await this.service.startMatch(match.match.id);
    };
    this.updateTurn();
  }

  async updateMatch(){
    var result;
    if(match.match.id != undefined){
      console.log("EventIndex: " + match.match.eventIndex);
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
      }, 100);
    }
  }


  async endMatch(){
    await this.service.endMatch(match.match.id);
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
      console.log(match.match.playerDataA.cardsPile);
      console.log(this.serviceCard.playableCards);
      console.log("id de la carte joué" + cardId);
      console.log(match);
      match.match.playerDataA.cardsPile.splice();

      if(cardId != undefined){
        let result = await this.service.playCard(match.match.id, cardId?.id);
        this.processEvents(result);
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
    await this.serviceCard.getInventory();
  }

  toggleAnim() {
    this.matchStartAnim = !this.matchStartAnim
  }

  async processEvents(event : any){
    if(event.$type == "StartMatch"){
      console.log("Event: StartMatch");
      await this.StartMatchEvent();
      match.match.eventIndex = 1;
    }
    else if(event.$type == "DrawCard"){
      if(this.cardDrew >= 7){
        match.match.eventIndex++;
      }
      this.cardDrew++;
      console.log("Event: DrawCard id " + event.PlayableCardId + " for player " + event.PlayerId);
      if(event.PlayerId == this.playerId){
        await this.DrawCardCurrent(event.PlayableCardId);
        
      }else{
        await this.DrawCardenemy(event.PlayableCardId);
      }
    }
    else if(event.$type == "PlayCard"){
      console.log("playcard");
    }
    else if(event.$type =="PlayerTurn"){
      console.log("Current player: " + this.playerId.id + "\nPlayerTurnEvent id : " + event.PlayerId);
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

  async StartMatchEvent(){
    this.matchStartAnim = true;
    setTimeout(() => {
      this.matchStartAnim = false;
    }, 3000);
  }

  DrawCardCurrent(cardId : number){
    var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
    console.log(card);
    this.serviceCard.currentHand.push(card!.card);
    this.serviceCard.animateCardId = cardId;
    console.log(this.serviceCard.animateCardId);
  }

  async DrawCardenemy(cardId : number){
    var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
    console.log(card);
    this.serviceCard.enemyHand.push(card!.card);
    this._drawCard = true;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}