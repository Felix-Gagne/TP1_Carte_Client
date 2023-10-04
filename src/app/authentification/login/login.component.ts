import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/services/user-services.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  username : string = "";
  password : string = "";
  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  formData?: Data;
  constructor(public service : UserServicesService, public http : HttpClient, public router : Router, private fb : FormBuilder) { }

  ngOnInit() {
    this.form.valueChanges.subscribe(() =>{
      this.formData = this.form.value;
    });
  }

  async login(){
    try
    {
      if(this.formData?.username != null && this.formData.password != null)
      {
        await this.service.login(this.formData?.username, this.formData.password);
      }
      this.router.navigate(['/home']);
    }
    catch(e)
    {
      console.log("Woops, une erreur c'est produite...");
    }
  }

}

interface Data{
  username?: string | null;
  password?: string | null;
}
