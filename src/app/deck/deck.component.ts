import { CardServiceService } from './../services/card-service.service';
import { CardComponent } from './../card/card.component';
import { Component, OnInit } from '@angular/core';
import { CardDTO } from '../Models/CardDTO';
import { FormBuilder } from '@angular/forms';
import { Data } from '@angular/router';
import { InventoryOwnedCards } from '../Models/inventoryCards';
import { StoreService } from '../services/store.service';
import { UserServicesService } from '../services/user-services.service';
import { Deck } from '../Models/Deck';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  showDeck : boolean = false;
  deleteDeck : boolean = false;
  newDeck : boolean = false;
  deckName : string = "";
  editingDeck : boolean = false;

  decks : Deck[] = [];
  selectedDeck! : Deck;
  selectNb : number = 0;
  selectFull : boolean = true;
  selectedCards : number[] = [];
  maxSelections = 10;
  

  lesFiltres = ["Attack", "Defense", "Name"];
  selectedFiltre = "";
  selectedFiltreAllCards = "";

  infoCard:boolean = false;

  money:number = 0;
  newMoney: number = 0;
  stopStealingMyMoney = true;
  async ngOnInit() {
    this.decks = await this.cardServiceService.getDecks();
    this.AllCards = await this.cardServiceService.getAllCards();
  }

 
  showDeckContent(id:number){
    this.decks.forEach(deck => {
      if(deck.id == id){
        this.selectedDeck = {...deck};
        this.selectedDeck.cards = [];
        console.log(deck.cards);
        deck.cards.forEach(c => {
          console.log(c.card);
          this.selectedDeck.cards.push(c.card);
        });
      this.showDeck = true;
      }
    });

  constructor(public cardServiceService: CardServiceService, public sellCard: StoreService, public userService: UserServicesService) { }
  }

  editDeck(){
    this.editingDeck  = !this.editingDeck;
    this.AllCards.forEach(card =>{
      this.selectedDeck.cards.forEach(deckCard =>{
        if(card.id == deckCard.id){
          this.selectedCards.push(card.id);
        }
      })
    })
    console.log(this.editingDeck);
  }
  saveDeck(){
    this.editingDeck = false;
    this.showDeck = false;
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

  async addDeck() {
    if(this.deckName == ""){

    }else{
      console.log(this.deckName);
      console.log(this.selectedCards.slice());
      await this.cardServiceService.newDeck(this.deckName, this.selectedCards);
      this.decks = await this.cardServiceService.getDecks();
      this.closeNewDeck();
    }
  }

  toggleSelection(card: CardDTO): void {
    const selectedIndex = this.selectedCards.findIndex(selectedCard => selectedCard === card.id);
    if (selectedIndex === -1 && this.selectedCards.length < this.maxSelections) {
      this.selectNb++;
      this.selectedCards.push(card.id);
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
    return this.selectedCards.some(selectedCard => selectedCard === card.id);
  }  
  
  deselectCard(card: CardDTO): void {
    const selectedIndex = this.selectedCards.findIndex(selectedCard => selectedCard === card.id);
    if (selectedIndex !== -1) {
      this.selectedCards.splice(selectedIndex, 1);
    }
  }
  

  handleDeckClick(event: Event) {
    if (event.target === event.currentTarget) {
        this.showDeck = false;
        this.newDeck = false;
        this.selectedCards = [];
        this.editingDeck = false;
    }
  };

  async delete(){
    await this.cardServiceService.deleteDeck(this.selectedDeck.id);
    this.decks = await this.cardServiceService.getDecks();
    this.deleteDeck = false;
    this.showDeck = false;
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