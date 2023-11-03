import { CardServiceService } from './../services/card-service.service';
import { CardComponent } from './../card/card.component';
import { Component, OnInit } from '@angular/core';
import { CardDTO } from '../Models/CardDTO';
import { FormBuilder } from '@angular/forms';
import { Data } from '@angular/router';
import { DeckDTO } from '../Models/DeckDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  newDeck : boolean = false;
  deckName : string = "";

  FakeDeckList : DeckDTO[] = [];
  fakeDeckContent : CardDTO[] = [];
  selectedDeckName : string = "";
  selectNb : number = 0;
  selectFull : boolean = true;
  selectedCards : CardDTO[] = [];
  maxSelections = 10;
  

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  constructor(public cardServiceService: CardServiceService, private snackBar: MatSnackBar) { }

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

  closeNewDeck(){
    this.selectNb = 0;
    this.selectedCards.length=0;
    this.newDeck = false;
    this.deckName = "";
  }

  addCardToDeck(card:CardDTO){
    this.selectNb++;
  }

  addDeck() {
    console.log(this.deckName);
    console.log(this.selectedCards.slice());
    this.closeNewDeck();
  }

  toggleSelection(card: CardDTO): void {
    const selectedIndex = this.selectedCards.findIndex(selectedCard => selectedCard.id === card.id);
    if (selectedIndex === -1 && this.selectedCards.length < this.maxSelections) {
      this.selectNb++;
      this.selectedCards.push(card);
    } else if (selectedIndex !== -1) {
      this.selectedCards.splice(selectedIndex, 1);
      this.selectNb--;
    }else if (this.selectedCards.length >= this.maxSelections) {
      this.snackBar.open("Déja 10 cartes choisis!", 'OK', {
        duration: 3000,
        panelClass: ['snackbar'],
      });
    }
  }
  
  
  isSelected(card: CardDTO): boolean {
    return this.selectedCards.some(selectedCard => selectedCard.id === card.id);
  }  
  
  deselectCard(card: CardDTO): void {
    const selectedIndex = this.selectedCards.findIndex(selectedCard => selectedCard.id === card.id);
    if (selectedIndex !== -1) {
      this.selectedCards.splice(selectedIndex, 1);
    }
  }
  

  handleDeckClick(event: Event) {
    if (event.target === event.currentTarget) {
        this.showDeck = false;
        this.newDeck = false;
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