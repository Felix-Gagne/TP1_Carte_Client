import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { StoreCards } from 'src/app/Models/StoreCards';  // Import the StoreCards class
import { UserServicesService } from 'src/app/services/user-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, take, timer } from 'rxjs';

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

  cardBought = false;
  stopStealingMyMoney = true;




  
  constructor(public storeService: StoreService, public userService:UserServicesService, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    this.storeCardsList = await this.storeService.getBuyableCards();
    this.money = await this.userService.getMoney();
    this.newMoney = await this.userService.getMoney();
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


}
