import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { StoreCards } from 'src/app/Models/StoreCards';  // Import the StoreCards class
import { UserServicesService } from 'src/app/services/user-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, take, timer } from 'rxjs';
import { Pack } from 'src/app/Models/Pack';
import { CardDTO } from 'src/app/Models/CardDTO';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storeCardsList: StoreCards[] = [];
  money:number = 0;
  storeCard?:StoreCards;
  newMoney: number = 0; // Add the newMoney variable
  selectedCard? : StoreCards;

  decreaseAmount : number =0;

  cards : boolean = true;
  packs : boolean = false;
  cases : boolean = false;

  ShowingCards : boolean = false;
  packList : Pack[] = [];
  cardList : CardDTO[] = [];

  cardBought = false;
  stopStealingMyMoney = true;

  
  constructor(public storeService: StoreService, public userService:UserServicesService, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    this.storeCardsList = await this.storeService.getBuyableCards();
    this.packList = await this.storeService.GetPacks();
    this.money = await this.userService.getMoney();
    this.newMoney = await this.userService.getMoney();
  }

  selectStore(id : number){
    if(id==1){
      this.packs = false;
      this.cases = false;
      this.cards = true;
    }else if(id==2){
      this.cards = false;
      this.cases = false;
      this.packs = true;
    }else if(id==3){
      this.cards = false;
      this.packs = false;
      this.cases = true;
    }
  }

  startCountdown() {
      console.log(this.money + "money")
      console.log(this.newMoney + "new money")
      const countdown = () => {
        if (this.money < this.newMoney) {
          setTimeout(() => {
            this.newMoney--;
            countdown();
          }, 10);
        } else {
          this.stopStealingMyMoney = true;
        }
      };
    
      countdown();
    
  }

  //En cours
  async buyCard(cardId:number){
    var argentTexte = localStorage.getItem('money');
    this.money = await this.userService.getMoney();
    if(cardId != null){
      this.selectedCard = this.storeCardsList.find(card => card.id === cardId);
      if(this.selectedCard != null){
        if(this.money >= this.selectedCard?.buyAmount){
          this.showSnackbar('The card was sucesfuly bought. Please buy another one')
          this.cardBought = true;
          await this.storeService.buyCards(cardId);
          this.money = await this.userService.getMoney();
          this.stopStealingMyMoney = false;
          this.startCountdown(); // Start the countdown
          setTimeout(async () => {
            this.cardBought = false;
          }, 3000);
        }
        else{
          console.log('pauvre')
          this.showSnackbar('You dont have enough money to buy this card. Please recharge money to process!')
        }
      }
    }
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }



  async BuyPack(packId : number){
    if(this.money >= this.decreaseAmount){
      this.cardList = await this.storeService.BuyPack(packId);
      this.money = await this.userService.getMoney();
            this.stopStealingMyMoney = false;
            this.startCountdown();
      this.ShowingCards = true;
    }else{
      console.log('pauvre')
      this.showSnackbar('You dont have enough money to buy this pack. Please recharge money to process!')
    }
  }

  handleDeckClick(event: Event) {
    if (event.target === event.currentTarget) {
        this.ShowingCards = false;
        this.cardList = [];
    }
  };

}
