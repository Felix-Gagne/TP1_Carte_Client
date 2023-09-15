import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/services/user-services.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  username : string = "";
  password : string = "";

  constructor(public service : UserServicesService, public http : HttpClient, public router : Router) { }

  ngOnInit() {

  }

  async login(){
    try
    {
      await this.service.login(this.username, this.password);
      this.router.navigate(['/home']);
    }
    catch(e)
    {
      console.log("Woops, une erreur c'est produite...");
    }
  }

}
