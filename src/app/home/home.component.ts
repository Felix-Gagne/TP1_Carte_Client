import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  catcard = {
    name: "Chat Jedi",
    attack: 2,
    defense: 10,
    imageUrl:"https://images.squarespace-cdn.com/content/51b3dc8ee4b051b96ceb10de/1394662654865-JKOZ7ZFF39247VYDTGG9/hilarious-jedi-cats-fight-video-preview.jpg?content-type=image%2Fjpeg"
  }

  constructor(public service : UserServicesService, public http : HttpClient, public router : Router) { }

  ngOnInit() {
    
  }


  async signOut(){
    try{
      await this.service.signout();
      this.router.navigate(['/login']);
    } catch(e){
      console.log("Woops, une erreur c'est produite...");
    }
    
  }
    
  
}