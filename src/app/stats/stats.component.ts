import { ChangeDetectorRef, Component } from '@angular/core';
import { Deck } from '../Models/Deck';
import { StatsService } from '../services/stats.service';
import { CardServiceService } from '../services/card-service.service';
import { StatsDTO } from '../Models/StatsDTO';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  selectedDeck = "";
  deckList : Deck[] = [];
  stats? : StatsDTO;

  Wins:number = -1;
  Loses:number = -1;

  constructor(public statsService : StatsService, public cardService : CardServiceService) {}

  async ngOnInit(){
    this.stats = await this.statsService.GetGeneralStats();
    this.deckList = await this.cardService.getDecks();
  }


  getDeckStats(){

  }
}
