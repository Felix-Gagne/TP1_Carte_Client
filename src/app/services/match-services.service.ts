import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Match, PlayableCard, Player } from '../Models/MatchDTO';

@Injectable({
  providedIn: 'root'
})

export class MatchServicesService {

  match !: Match;
  playerB !: Player;
  playerA !: Player;

  //Pointeurs
  currentCardsPile !: PlayableCard[];
  currentHand !: PlayableCard[];
  currentBattlefield !: PlayableCard[];
  currentGraveyard !: PlayableCard[];

  enemyCardsPile !: PlayableCard[];
  enemyHand !: PlayableCard[];
  enemyBattlefield !: PlayableCard[];
  enemyGraveyard !: PlayableCard[];


  isCurrentTurn:boolean = false;
  matchStartAnim:boolean = false;
  _drawCard:boolean = false;
  playingCard:boolean = false;
  cardAttack:boolean = false;
  cardDeath:boolean = false;
  playerDamage:boolean = false;
  playerDeath:boolean = false


  currentUserId : string = "";
  playerId : any = 0;
  currentName:string = "";
  enemyName:string = "";
  cardDrew:number = 0;


  constructor(public http : HttpClient) { }

  //Requetes serveur
    async joinMatch()
    {
      let x  = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/JoinMatch", null));
      console.log("Join Match :" + x);
      this.match = x.match;
      this.playerA = x.playerA;
      this.playerB = x.playerB;
      if(this.playerId == this.playerA.id){
        this.currentCardsPile = this.match.playerDataA.cardsPile;
        this.currentHand = this.match.playerDataA.hand;
        this.currentBattlefield = this.match.playerDataA.battleField;
        this.currentGraveyard = this.match.playerDataA.graveyard;

        this.enemyCardsPile = this.match.playerDataB.cardsPile;
        this.enemyHand = this.match.playerDataB.hand;
        this.enemyBattlefield = this.match.playerDataB.battleField;
        this.enemyGraveyard = this.match.playerDataB.graveyard;
      }else{
        this.currentCardsPile = this.match.playerDataB.cardsPile;
        this.currentHand = this.match.playerDataB.hand;
        this.currentBattlefield = this.match.playerDataB.battleField;
        this.currentGraveyard = this.match.playerDataB.graveyard;

        this.enemyCardsPile = this.match.playerDataA.cardsPile;
        this.enemyHand = this.match.playerDataA.hand;
        this.enemyBattlefield = this.match.playerDataA.battleField;
        this.enemyGraveyard = this.match.playerDataA.graveyard;
      }
      return x;
    }

    async startMatchService(matchId : number)
    {
      try{
      let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/StartMatch/" + matchId, null));
      console.log("Start Match :" + x);
      }
      catch(e){
        console.log("Ce n'est pas votre tours")
      }

    }

    async updateMatchService(matchId : number, eventIndex : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/UpdateMatch/" + matchId + "/" + eventIndex));
      console.log("Update Match :" + x);
      return x;
    }

    async playCardService(matchId : number, cardId : number){
      let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+"api/Match/PlayCard/" + matchId + "/" + cardId, null));
      console.log("PlayCard: " + x);
      console.log(x);
      return x;
    }

    async endMatchService(matchId : number){
      let x = await lastValueFrom(this.http.get<any>(environment.apiUrl+"api/Match/EndMatch/" + matchId));
      console.log(x);
    }





    //Match Service
    async startMatch(){
      if(this.currentUserId == this.match.userBId){
            await this.startMatchService(this.match.id);
      };
    }
    async updateMatch(){
      var result;
      if(this.match.id != undefined){
        console.log("EventIndex: " + this.match.eventIndex);
        result = await this.updateMatchService(this.match.id, this.match.eventIndex);
      } 
      if(result != null){
        await this.processAllEvents(JSON.parse(result));
        this.updateTurn();
        this.updateMatch();
      }else{
        console.log("updating...")
        setTimeout(() => {
          this.updateMatch();
        }, 1000);
      }
    }

    async processAllEvents(event: any){
      await this.processEvents(event);
      this.match.eventIndex++;
    }
    async processEvents(event : any){
      if(event.$type == "StartMatch"){
        console.log("Event: StartMatch");
        await this.StartMatchEvent();
      }
      else if(event.$type == "DrawCard"){
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
          this.match.isPlayerATurn = false;
        }else{
          this.isCurrentTurn = false;
          this.match.isPlayerATurn = true;
        }
      }
      if(event.Events != null){
        event.Events.forEach(async (event : any) => {
          await this.processEvents(event);
        });
      }
    }

    async playCard(){
      if(this.isCurrentTurn){
        this.playingCard = true;
        //var cardName = await this.serviceCard.clickedCard;
        //let cardId = this.serviceCard.cardList.find((card : any) => card.name === cardName);
        //console.log("card depuis match: " + cardName);
        //console.log("card id: " + cardId?.id);
        //console.log(match.match.playerDataA.cardsPile);
        //console.log(this.serviceCard.playableCards);
        //console.log("id de la carte joué" + cardId);
        console.log(this.match);
        //this.match.playerDataA.cardsPile.splice();
  
        //if(cardId != undefined){
          //let result = await this.playCardService(this.match.id, cardId?.id);
          // Présentement on update seulement avec UpdateMatch
          //this.processEvents(result);
        //}
  
      }
    }

    async StartMatchEvent(){
      this.matchStartAnim = true;
      setTimeout(() => {
        this.matchStartAnim = false;
      }, 3000);
    }

    updateTurn(){
      if(this.match.isPlayerATurn && (this.playerId == this.playerA.id)){
        this.isCurrentTurn = true;
        console.log("its my turn");
      }else if(this.playerId == this.playerB.id){
        this.isCurrentTurn = true;
        console.log("its my turn");
      }
    }

    toggleAnim() {
        this.matchStartAnim = !this.matchStartAnim
    }

    DrawCardCurrent(cardId : number){
      //var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
      //console.log(card);
      //this.serviceCard.currentHand.push(card!.card);
      //this.serviceCard.animateCardId = cardId;
      //console.log(this.serviceCard.animateCardId);
    }
  
    async DrawCardenemy(cardId : number){
      //var card = this.serviceCard.playableCards.find((card : any) => card.id == cardId);
      //console.log(card);
      //this.serviceCard.enemyHand.push(card!.card);
      //this.service._drawCard = true;
    }

    async endMatch(){
      await this.endMatchService(this.match.id);
    }

}
