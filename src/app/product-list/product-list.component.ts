import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DbCommsService, Product } from '../db-comms.service';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  allProducts: Product[] = [];
  searchedProducts: Product[] = [];
  aSubscription: Subscription;
  searchParam: string = '';

  constructor(private dbComms: DbCommsService, private userService: UserServiceService, private router: Router) {
    this.aSubscription = interval(10).subscribe(() => {
      if (!this.userService.loggedInStatus) {
        alert('Session Timed Out!');
        this.router.navigate(['login']);
        this.ngOnDestroy();
      }
    })
    this.allProducts = this.dbComms.products;
    this.searchedProducts = [...this.allProducts];
  }

  searchProds() {
    this.searchedProducts = [];
    for (let x of this.allProducts) {
      if (x.productName.toLowerCase().includes(this.searchParam.toLowerCase())) {
        this.searchedProducts.push(x)
      }
    }
  }

  addToCart(pID: number) {
    this.dbComms.addProdToCart(pID);
  }

  buyItem(pID: number) {
    let bool: boolean = confirm("Do you Want to Buy?")
    if(bool) {this.dbComms.buyProd(pID)}
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.aSubscription.unsubscribe();
  }
}
