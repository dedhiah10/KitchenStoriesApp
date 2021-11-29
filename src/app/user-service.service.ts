import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) { }

  get token(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return '';
    }
    else { return this._token; }
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private usersArray: User[] = [];
  private loggedIn: boolean = false;

  constructor() {
    interval(10).subscribe(() => {
      if (this.usersArray.length > 0) {
        if (this.usersArray[this.usersArray.length - 1].token == '') {
          this.loggedIn = false
        }
      }
    })
  }


  public get loggedInStatus(): boolean {
    return this.loggedIn;
  }


  getUserToken(): string {
    if (this.loggedIn) {
      return this.usersArray[this.usersArray.length - 1].token;
    } else {return '';}
  }

  getEmailId(): string {
    return this.usersArray[this.usersArray.length - 1].email;
  }

  addUser(user: User) {
    this.usersArray.push(user);
    this.loggedIn = true;
  }

  validUserAvail(): boolean {
    if (this.usersArray.length <= 0) {
      return false;
    } else if (this.usersArray[this.usersArray.length - 1].token == (null || '')) {
      return false;
    } else { return true; }
  }
}
