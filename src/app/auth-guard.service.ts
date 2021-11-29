import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userService: UserServiceService, private router: Router) {}

  canActivate(): boolean {
    if(this.userService.loggedInStatus) {return true;}
    else {this.router.navigate(['login']); return false;}
  }
}
