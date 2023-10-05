import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../Models/RegisterDTO';
import { HttpClient } from '@angular/common/http';
import { LoginDTO } from '../Models/LoginDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(public http : HttpClient) { }

  async register(username : string, email : string, password : string, passwordConfirm : string)
  {
    let registerDTO = new RegisterDTO(
      username,
      email,
      password,
      passwordConfirm
    );

    let x = await lastValueFrom(this.http.post<RegisterDTO>(environment.apiUrl+'api/User/Register', registerDTO));
    console.log(x);
  }

  async login(username : string, password : string)
  {
    let loginDTO = new LoginDTO(
      username,
      password
    );
    
    let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+'api/User/Login', loginDTO));
    console.log(x.id);
    localStorage.setItem('userId', x.id);
  }

  async signOut(){
    let x = await lastValueFrom(this.http.post<any>(environment.apiUrl+'api/User/SignOut', null));
    console.log(x);
  }
}
