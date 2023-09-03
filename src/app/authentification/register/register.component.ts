import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServicesService } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hidePassword = true;
  hideConfirmation = true;

  username : string = "";
  email : string = "";
  password : string = "";
  passwordConfirm = "";

  constructor(public service : UserServicesService) { }

  ngOnInit() {
    
  }

  async register(){
    await this.service.register(this.username, this.email, this.password, this.passwordConfirm);
  }

}
