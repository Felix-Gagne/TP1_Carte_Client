import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { StoreCards } from 'src/app/Models/StoreCards';  // Import the StoreCards class

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  storeCardsList: StoreCards[] = [];

  constructor(public storeService: StoreService) {}

  async ngOnInit() {
    this.storeCardsList = await this.storeService.getBuyableCards();
  }
}
