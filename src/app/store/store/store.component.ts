import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { StoreCards } from 'src/app/Models/StoreCards';  // Import the StoreCards class
import { UserServicesService } from 'src/app/services/user-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storeCardsList: StoreCards[] = [];
  money:number = 0;
  storeCard?:StoreCards;
  
  constructor(public storeService: StoreService, public userService:UserServicesService, private snackBar: MatSnackBar) {}

  async ngOnInit() {
    this.storeCardsList = await this.storeService.getBuyableCards();
    this.money = await this.userService.getMoney();

  }


  //En cours
  async buyCard(cardId:number){
    var argentTexte = localStorage.getItem('money');
    this.money = await this.userService.getMoney();
    if(cardId != null){
      var selectedCard = this.storeCardsList.find(card => card.id === cardId);
      if(selectedCard != null){
        if(this.money >= selectedCard?.buyAmount){
          await this.storeService.buyCards(cardId);
          this.money = await this.userService.getMoney();
          this.showSnackbar('The card was sucesfuly bought. Please buy another one')
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
