import { Component } from '@angular/core';
import { Deck } from '../Models/Deck';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  selectedDeck = "";
  deckList : Deck[] = [];

  async ngOnInit(){
    
  }


  getDeckStats(){

  }
}
