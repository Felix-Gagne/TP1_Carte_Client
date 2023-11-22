import { CardServiceService } from './../services/card-service.service';
import { CardComponent } from './../card/card.component';
import { Component, OnInit } from '@angular/core';
import { CardDTO } from '../Models/CardDTO';
import { FormBuilder } from '@angular/forms';
import { Data } from '@angular/router';
import { InventoryOwnedCards } from '../Models/inventoryCards';
import { StoreService } from '../services/store.service';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  cardList : InventoryOwnedCards[] = [];
  mecards : InventoryOwnedCards[] = [];
  AllCards : InventoryOwnedCards[] = [];
  truecardlist : InventoryOwnedCards[] = [];
  infoUneCarte ?: InventoryOwnedCards;

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  infoCard:boolean = false;

  money:number = 0;
  newMoney: number = 0;
  stopStealingMyMoney = true;


  constructor(public cardServiceService: CardServiceService, public sellCard: StoreService, public userService: UserServicesService) { }

  async ngOnInit() {
    console.log('merde');
    this.AllCards = await this.cardServiceService.getInventory();
    console.log('merde');
    console.log(this.AllCards);
    this.money = await this.userService.getMoney();
    this.newMoney = await this.userService.getMoney();
  }

  afficherCarte(carte:InventoryOwnedCards){
    this.infoCard = true;
    console.log(this.infoCard)
    if(carte!= null){
      this.infoUneCarte = carte;
      //console.log(this.infoUneCarte.name);
      console.log(this.infoUneCarte);
    }
  }

  async vendreCarte(carte:InventoryOwnedCards){
    console.log(carte);
    var userId = localStorage.getItem('userId');
    console.log(userId);
    if(userId!=null){
      if(carte != null){
        await this.sellCard.sellCard(carte.id);
        this.AllCards = await this.cardServiceService.getInventory()
        console.log('liste de carte apres la vente');
        console.log(this.AllCards);
        this.stopStealingMyMoney = false;
        this.startCountdown(carte.card);
        this.infoCard = false;
      }
    }
  }

  startCountdown(card:CardDTO) {
    console.log(card);
    console.log(card.name);
    console.log(card.prixVente);
    console.log(this.money + "money")
    console.log(this.newMoney + "new money")
    this.newMoney += card.prixVente;
    const countdown = () => {
      if (this.money < this.newMoney) {
        setTimeout(() => {
          this.money++;
          countdown();
        }, 10);
      } else {
        this.stopStealingMyMoney = true;
      }
    };
  
    countdown();
  
}

  async Filtrage(){

    this.truecardlist = [];

    console.log(this.selectedFiltre);
    if(this.selectedFiltre === undefined){
      this.truecardlist = await this.cardServiceService.getInventory();
    } else {
      if(this.selectedFiltre.length != 0){
        this.cardList = await this.cardServiceService.getFilteredCards(this.selectedFiltre);
        for (let index = 0; index < this.cardList.length; index++) {
          for (let injex = 0; injex < this.mecards.length; injex++) {
            if(this.cardList[index].id === this.mecards[injex].id){
              this.truecardlist.push(this.cardList[index]);
            }
          }    
        }
        console.log(this.cardList);
        console.log(this.truecardlist);
      }
    }
  }

  async FiltrageAllCards(){
    console.log(this.selectedFiltreAllCards);
    if(this.selectedFiltreAllCards === undefined){
      this.AllCards = await this.cardServiceService.getFilteredCards(this.selectedFiltreAllCards);
    } else {
      if(this.selectedFiltreAllCards.length != 0){
        this.AllCards = await this.cardServiceService.getFilteredCards(this.selectedFiltreAllCards);
      }
    }
  }

  close(){
    this.infoCard = false;
  }

  handleDeckClickcard(event: Event) {
    if (event.target === event.currentTarget) {
        this.infoCard = false;
    }
  };
}