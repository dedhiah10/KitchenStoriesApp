import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-login-comp',
  templateUrl: './login-comp.component.html',
  styleUrls: ['./login-comp.component.css']
})
export class LoginCompComponent implements OnInit {
  @ViewChild('f') loginForm!: NgForm;

  constructor(
    private loginService: LoginServiceService,
    private userService: UserServiceService,
    private router: Router) {
    if (userService.validUserAvail()) {
      router.navigate(['/home']);
    }
  }

  ngOnInit(): void {}

  loginWithTest() {
    this.loginService.signInFunc("Test@example.com", '1234567890');
  }

  onSubmit(f: NgForm): void {
    if (f.valid) {
      if(f.form.value['signUp'] == true){this.loginService.signUpFunc(f.form.value.userName, f.form.value.pWord)}
      else {this.loginService.signInFunc(f.form.value.userName, f.form.value.pWord)}
    }
    f.reset();
  }
}
