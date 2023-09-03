import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../Models/RegisterDTO';
import { HttpClient } from '@angular/common/http';

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

    let x = await lastValueFrom(this.http.post<RegisterDTO>('https://localhost:7219/api/User/Register', registerDTO, options));
  }
}
