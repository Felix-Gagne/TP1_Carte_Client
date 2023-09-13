import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/services/user-services.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  username : string = "";
  password : string = "";

  constructor(public service : UserServicesService, public http : HttpClient) { }

  ngOnInit() {

  }

  async login(){
    await this.service.login(this.username, this.password);
  }

}
