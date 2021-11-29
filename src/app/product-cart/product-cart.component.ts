import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DbCommsService, Product } from '../db-comms.service';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit, OnDestroy {
  aSubscription: Subscription;
  userData: { cart: Product[], transaction: Product[] } = { cart: [], transaction: [] };
  email: string = '';
  buttonBool: boolean = false;
  buttonMessage: string = "Show Transactions!";
  cartPrice: number = 0;

  constructor(
    private router: Router,
    private userService: UserServiceService,
    private dbComms: DbCommsService
  ) {
    this.userData = this.dbComms.userData;
    this.aSubscription = interval(10).subscribe(() => {
      if (!this.userService.loggedInStatus) {
        this.router.navigate(['login']);
        alert('Session Timed Out!');
        this.ngOnDestroy();
      }
    })
    this.email = this.userService.getEmailId();
    this.calcPrice();
  }

  checkoutCart() {
    let bool: boolean = confirm("Do you Want to Buy?");
    if (bool) {
      let cartpIDs: number[] = [];
      for (let x of this.userData['cart']) {
        cartpIDs.push(x.pID);
      }
      for (let x of cartpIDs) {
        this.buyFromCart(x);
      }
    }
    this.calcPrice();
  }

  calcPrice(): void {
    this.cartPrice = 0;
    for(let x of this.userData['cart']) {
      this.cartPrice += (x.productPrice * x.productQuantity * 1000);
    }
    this.cartPrice = Math.round(this.cartPrice) / 1000;
  }

  toggleCartTrans() {
    if (this.buttonBool) {
      this.buttonBool = !this.buttonBool;
      this.buttonMessage = "Show Transactions!";
    } else {
      this.buttonBool = !this.buttonBool;
      this.buttonMessage = "Show Cart!"
    }
  }

  removeFromCart(pID: number) {
    let bool: boolean = confirm("Do you want to remove from cart?")
    if (bool) { this.dbComms.removeProdFromCart(pID); this.calcPrice(); }
  }

  buyFromCart(pID: number) {
    let bool: boolean = confirm("Do you Want to Buy?")
    if (bool) { this.dbComms.buyProdFromCart(pID); this.calcPrice(); }
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.aSubscription.unsubscribe();
  }
}