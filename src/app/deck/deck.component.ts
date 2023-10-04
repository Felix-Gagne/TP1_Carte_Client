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
  AllCards : CardDTO[] = [];
  

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  constructor(public cardServiceService: CardServiceService) { }

  async ngOnInit() {

    this.cardList = await this.cardServiceService.getdeck();

    this.AllCards = await this.cardServiceService.getAllCards();

    /*for (let cardJoueur of this.cardList) {
      if(this.cardList.includes(cardJoueur)){
        this.AllCards.splice(cardJoueur.id);
      }
    }
    for (let cardJoueur of this.cardList) {
      if(this.cardList.includes(cardJoueur) && this.AllCards.length === 1){
        this.AllCards.pop();
      }
    }*/
  }

  async Filtrage(){
    console.log(this.selectedFiltre);
    if(this.selectedFiltre === undefined){
      this.cardList = await this.cardServiceService.getFilteredCards(this.selectedFiltre);
    } else {
      if(this.selectedFiltre.length != 0){
        this.cardList = await this.cardServiceService.getFilteredCards(this.selectedFiltre);
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
}