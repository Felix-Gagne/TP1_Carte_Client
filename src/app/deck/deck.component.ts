import { CardServiceService } from './../services/card-service.service';
import { CardComponent } from './../card/card.component';
import { Component, OnInit } from '@angular/core';
import { CardDTO } from '../Models/CardDTO';
import { FormBuilder } from '@angular/forms';
import { Data } from '@angular/router';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  cardList : CardDTO[] = [];
  mecards : CardDTO[] = [];
  AllCards : CardDTO[] = [];
  truecardlist : CardDTO[] = [];
  infoUneCarte ?: CardDTO;

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  infoCard:boolean = false;

  constructor(public cardServiceService: CardServiceService) { }

  async ngOnInit() {
    this.AllCards = await this.cardServiceService.getInventory();
  }

  afficherCarte(carte:CardDTO){
    this.infoCard = true;
    console.log(this.infoCard)
    if(carte!= null){
      this.infoUneCarte = carte;
      console.log(this.infoUneCarte.name);
      console.log(this.infoUneCarte);
    }
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