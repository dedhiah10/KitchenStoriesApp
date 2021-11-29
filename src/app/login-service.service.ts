import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserServiceService } from './user-service.service';
import { DbCommsService } from './db-comms.service';
import { Router } from '@angular/router';

export interface SigningResponseData {
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:number;
  localId:string;
  registered?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  signUpData!: SigningResponseData;

  constructor(
    private http: HttpClient, 
    private userServce: UserServiceService, 
    private dbComms: DbCommsService,
    private router: Router
    ) { }

  signUpFunc(userName:string, pWord:string) {
    this.http.post<SigningResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC-wkuZpF2a2_26pIDQXpYDbxCOXTd3D30',{
      email: userName,
      password: pWord,
      returnSecureToken: true
    }).subscribe(respData => {
      this.userAdd(respData)
      this.dbComms.fetchProducts();
      this.dbComms.fetchUserDataFromBack();
      setTimeout(() => {this.router.navigate(['userdetails'])}, 300)
    });
  }

  signInFunc(userName:string, pWord:string) {
    this.http.post<SigningResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC-wkuZpF2a2_26pIDQXpYDbxCOXTd3D30',{
      email: userName,
      password: pWord,
      returnSecureToken: true
    }).subscribe(respData => {
      this.userAdd(respData);
      this.dbComms.fetchProducts();
      this.dbComms.fetchUserDataFromBack();
      setTimeout(() => {this.router.navigate(['userdetails'])}, 300)
    });
  }

  userAdd(respData:any) {
    const expirationDate = new Date(new Date().getTime() + ((+respData.expiresIn)*1000) - 2000);
      const user: User = new User(respData.email, respData.localId, respData.idToken, expirationDate);
      this.userServce.addUser(user);
  }
}