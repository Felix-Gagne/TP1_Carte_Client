import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../Models/RegisterDTO';
import { HttpClient } from '@angular/common/http';
import { LoginDTO } from '../Models/LoginDTO';
import { environment } from 'src/environments/environment.development';

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

    let options = { withCredentials:true }

    let x = await lastValueFrom(this.http.post<RegisterDTO>(environment.apiUrl+'api/User/Register', registerDTO, options));
  }

  async login(username : string, password : string)
  {
    let loginDTO = new LoginDTO(
      username,
      password
    );

    let options = { withCredentials : true }
    
    let x = await lastValueFrom(this.http.post<LoginDTO>(environment.apiUrl+'api/User/Login', loginDTO, options))
  }
}
