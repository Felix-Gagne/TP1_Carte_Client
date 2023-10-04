import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  form = this.fb.group({
    email: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    passwordConfirm: ['', [Validators.required]]
  },{validators: this.matchingPasswordValidator});
  formData?: Data;

  constructor(public service : UserServicesService, public router : Router, private fb : FormBuilder) { }

  ngOnInit() {
    this.form.valueChanges.subscribe(() =>{
      this.formData = this.form.value;
    });
  }

  async register(){
    try{
      if(this.formData?.username != null && this.formData.email != null
        && this.formData.password != null && this.formData.passwordConfirm != null){
          await this.service.register(this.username, this.email, this.password, this.passwordConfirm);
          this.router.navigate(['/login']);
        }
    }
    catch(e){
      console.log("Sa plante ici");
    }
  }

  matchingPasswordValidator(control: AbstractControl): ValidationErrors | null{
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if(!password || ! passwordConfirm){
      return null;
    }

    let formValid = password == passwordConfirm;


    if(!formValid){
      control.get('passwordConfirm')?.setErrors({unmatchingPassword:true});
    }
    else{
      control.get('passwordConfirm')?.setErrors({unmatchingPassword:false});
    }

    return !formValid?{unmatchingPassword:true}:null;
  }

}

interface Data{
  email?: string | null;
  username?: string | null;
  password?: string | null;
  passwordConfirm?: string | null;
}
