import { Component, OnInit, } from '@angular/core';
import { MatchServicesService } from '../services/match-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardServiceService } from '../services/card-service.service';
import { EMPTY_SUBSCRIPTION } from 'rxjs/internal/Subscription';
import { JsonPipe } from '@angular/common';
import { CardDTO } from '../Models/CardDTO';
import { timer } from 'rxjs';
import * as signalR from '@microsoft/signalr';

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
  private hubConnection?: signalR.HubConnection;

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
    //Get PlayerID
    this.route.paramMap.subscribe(params => {
      this.playerId = Number(params.get('playerid'));
  });

  //Voir Who starts
  if(this.playerId == match.playerA.id){
    this.currentName = match.playerA.name;
    this.enemyName = match.playerB.name;
  }else{
    this.currentName = match.playerB.name;
    this.enemyName = match.playerA.name;
  }

  //Variable qui contient le Id
  this.currentUserId = localStorage.getItem("userId")!;

  //
  //Console Logs
  //
  console.log(this.playerId);
  console.log(match);
  //
  //
  //

  //Connection au Hub
  this.connecttoHub();

  //Join et Start Match
  await this.startMatch();

  //Obtenir les Cartes dans les decks
  this.getCards();
}

/// Summary
/// ========
/// Méthode qui fait la connection Client-Serveur
connecttoHub(){
  this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7289/matchHub')
  .build();

  this.hubConnection
    .start()
    .then(() => {
      console.log('La connexion est live!');

      this.hubConnection!.on('NeedUpdateMatch', (data) => {
        console.log(data);
      });
    })
    .catch(err => console.log('Error while starting connection: ' + err))
}
/// Fin de la Méthode
///

// Création du Match
async startMatch(){
  this.updateTurn();
}
//


// Méthode Surrender
async Surrender(){
  await this.hubConnection!.invoke('Surrender', match.match.id);

  await this.endMatch();
}
//

  //Update Le Match au besoin
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
    }
  }


  async endMatch(){
    await this.hubConnection!.invoke('EndMatch', match.match.id);
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
        let result = await this.hubConnection!.invoke(match.match.id, cardId?.id);
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


  //La Méthode qui gère les Events
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

  // Animation du StartMatch
  async StartMatchEvent(){
    this.matchStartAnim = true;
    setTimeout(() => {
      this.matchStartAnim = false;
    }, 3000);
  }
  //

  // Plus de Méthode Animations
  toggleAnim() {
    this.matchStartAnim = !this.matchStartAnim
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}