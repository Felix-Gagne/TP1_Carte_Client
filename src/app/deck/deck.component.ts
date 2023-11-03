import { CardServiceService } from './../services/card-service.service';
import { CardComponent } from './../card/card.component';
import { Component, OnInit } from '@angular/core';
import { CardDTO } from '../Models/CardDTO';
import { FormBuilder } from '@angular/forms';
import { Data } from '@angular/router';
import { DeckDTO } from '../Models/DeckDTO';

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
  showDeck : boolean = false;
  deleteDeck : boolean = false;

  FakeDeckList : DeckDTO[] = [];
  fakeDeckContent : CardDTO[] = [];
  selectedDeckName : string = "";
  

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  constructor(public cardServiceService: CardServiceService) { }

  async ngOnInit() {

    this.cardList = await this.cardServiceService.getdeck();

    this.truecardlist = await this.cardServiceService.getdeck();

    this.mecards = await this.cardServiceService.getdeck();

    this.AllCards = await this.cardServiceService.getAllCards();

    this.FakeDeckList = [ 
      new DeckDTO(1, "best deck", [this.cardServiceService.fakeCardList]),
      new DeckDTO(2, "deck de vlad",[this.cardServiceService.fakeCardList]),
      new DeckDTO(3, "funny deck",[this.cardServiceService.fakeCardList])
    ];
    this.fakeDeckContent = this.FakeDeckList[0].cards[0];
  }


  showDeckContent(id:number){
    this.FakeDeckList.forEach(deck => {
      if(deck.id == id){
        this.selectedDeckName = deck.name
      this.fakeDeckContent = deck.cards[0];
      this.showDeck = true;
      }
    });

  }

  handleDeckClick(event: Event) {
    if (event.target === event.currentTarget) {
        this.showDeck = false;
    }
  };

  delete(){
    this.deleteDeck = false;
    this.showDeck = false;
  }

  async Filtrage(){

    this.truecardlist = [];

    console.log(this.selectedFiltre);
    if(this.selectedFiltre === undefined){
      this.truecardlist = await this.cardServiceService.getdeck();
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
}