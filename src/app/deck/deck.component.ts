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

  constructor(public cardServiceService: CardServiceService, public sellCard: StoreService, public userService: UserServicesService, private snackBar: MatSnackBar) { }


  async ngOnInit() {
    this.decks = await this.cardServiceService.getDecks();
    this.AllCards = await this.cardServiceService.getInventory();
    this.money = await this.userService.getMoney();
    this.newMoney = await this.userService.getMoney();
  }

 
  showDeckContent(id:number){
    this.decks.forEach(deck => {
      if(deck.id == id){
        console.log(deck);
        this.selectedDeck = deck;
        /*
        this.selectedDeck = {...deck};
        this.selectedDeck.cards = [];
        deck.cards.forEach(c => {
          this.selectedDeck.cards.push(c.card);
        });*/
      this.showDeck = true;
      }
    });
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

  toggleSelection(card: InventoryOwnedCards): void {
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
  
  
  isSelected(card: InventoryOwnedCards): boolean {
    return this.selectedCards.some(selectedCard => selectedCard === card.id);
  }  
  
  deselectCard(card: InventoryOwnedCards): void {
    const selectedIndex = this.selectedCards.findIndex(selectedCard => selectedCard === card.id);
    if (selectedIndex !== -1) {
      this.selectedCards.splice(selectedIndex, 1);
    }
  }
  

  handleDeckClick(event: Event) {
    if (event.target === event.currentTarget) {
        this.showDeck = false;
        this.newDeck = false;
        this.selectNb = 0;
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
        this.decks = await this.cardServiceService.getDecks();
        this.AllCards = await this.cardServiceService.getInventory();
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

}