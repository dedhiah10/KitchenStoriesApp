import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { LoginCompComponent } from './login-comp/login-comp.component';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductListComponent } from './product-list/product-list.component';

const appRoutes:Routes = [
  {path: 'login', component: LoginCompComponent},
  {path: 'home', canActivate: [AuthGuardService], component: ProductListComponent},
  {path: 'userdetails', canActivate: [AuthGuardService], component: ProductCartComponent},
  {path: '**', redirectTo: 'login'}// component: LoginCompComponent
];

@NgModule ({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingService {

  constructor() { }
}
