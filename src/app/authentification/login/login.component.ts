import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  username : string = "";
  password : string = "";

  constructor(public service : UserServicesService) { }

  ngOnInit() {

  }

  async login(){
    await this.service.login(this.username, this.password);
  }

}
