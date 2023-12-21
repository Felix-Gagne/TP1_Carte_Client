import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { HttpClient } from '@angular/common/http';
import { MatchServicesService } from '../services/match-services.service';
import { Router, RouterModule } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading : boolean = false;
  userIsConnected : boolean = false;
  balance : number = 0;
  private hubConnection?: signalR.HubConnection;

  catcard = {
    name: "Chat Jedi",
    attack: 2,
    defense: 10,
    imageUrl:"https://images.squarespace-cdn.com/content/51b3dc8ee4b051b96ceb10de/1394662654865-JKOZ7ZFF39247VYDTGG9/hilarious-jedi-cats-fight-video-preview.jpg?content-type=image%2Fjpeg"
  }

  constructor(public userService : UserServicesService, public matchService : MatchServicesService, public http : HttpClient, public router : Router) { }

  async ngOnInit() {
    var user = localStorage.getItem("userId");
    console.log('Ce user est connecter :' + user);
    if(user != null){
      this.connecttoHub();
      this.balance = await this.userService.getMoney();
    }
  }

  connecttoHub(){
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7289/matchHub')
    .build();
  
    this.hubConnection
      .start()
      .then(() => {
        console.log('La connexion est live!');
  
        this.hubConnection!.on('ReceiveJoinMatchValue', (data) => {
          this.isLoading = false;
        });
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  

  async join()
  {
    this.isLoading = true;
    while (true)
    {
      if(!this.isLoading){
        break;
      }

      const result = await this.hubConnection!.invoke('JoinMatch');
      const userId = localStorage.getItem("userId");
      let playerId = 0;

      if (result !== null) {
        this.isLoading = false;

        if(userId == result.playerA.identityUserId)
        {
          playerId = result.playerA.id;
        }
        else if(userId == result.playerB.identityUserId){
          playerId = result.playerB.id;
        }

        this.router.navigate(['/match', playerId]);
        break;
      }

    }
  }

  async CancelQueue(){
    await this.hubConnection!.invoke('CancelQueue');
  }
  
  async signOut(){
    try{
      await this.userService.signOut();
      this.router.navigate(['/login']);
    } catch(e){
      console.log("Woops, une erreur c'est produite...");
    }
    
  }
    

}