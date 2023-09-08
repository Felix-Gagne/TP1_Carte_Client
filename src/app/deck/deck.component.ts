import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  stickcard = {
    name: "StickMan",
    attack: 3,
    defense: 5,
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYf_mZPa6loeLcatHmO1hzyHxB2MXHKVsFQ&usqp=CAU"
  }

  constructor() { }

  ngOnInit() {
  }

}
