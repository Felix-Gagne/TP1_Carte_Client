import { Component, Input, OnInit } from '@angular/core';
import { CardServiceService } from '../services/card-service.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() show:string = "front";
  @Input() health:number = 0;
  @Input() defense:number = 0;
  @Input() attack:number = 0;
  @Input() name:string = "";
  @Input() rarity:number =0;
  @Input() imageUrl:string = "";
  beautifulBackUrl = "https://i.pinimg.com/236x/3c/73/0d/3c730d6df70700a3c912a3c87d6d2027.jpg";

  constructor(public service : CardServiceService) { }

  ngOnInit() {
    
  }

  getBackgroundColor(rarity: number): string {
    switch (rarity) {
      case 0:
        return 'grey'; // Common
      case 1:
        return 'blue'; // Rare
      case 2:
        return 'purple'; // Epic
      case 3:
        return 'yellow'; // Legendary
      default:
        return 'grey';
    }
  }

  playCard(){
    this.service.clickedCard = this.name;
  }

}
