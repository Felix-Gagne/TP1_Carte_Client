import { Component } from '@angular/core';
import { Deck } from '../Models/Deck';
import { StatsService } from '../services/stats.service';
import { CardServiceService } from '../services/card-service.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  selectedDeck = "";
  deckList : Deck[] = [];

  constructor(public statsService : StatsService, public cardService : CardServiceService) {}

  async ngOnInit(){
    this.deckList = await this.cardService.getDecks();
  }


  getDeckStats(){

  }
}
