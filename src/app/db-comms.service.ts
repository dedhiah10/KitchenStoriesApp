import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserServiceService } from './user-service.service';

export class Product {
  pID: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productCategory: string;
  productQuantity: number = 1;
  url?:string;
  buyTime?: Date;

  constructor(
    pID: number,
    productName: string,
    productPrice: number,
    productDescription: string,
    productCategory: string, url:string
  ) {
    this.pID = pID;
    this.productName = productName;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productCategory = productCategory;
    this.url = url;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DbCommsService {
  products: Product[] = [];
  userData: { cart: Product[], transaction: Product[] } = { cart: [], transaction: [] };

  constructor(private userService: UserServiceService, private http: HttpClient) { }

  fetchProducts(): Product[] {
    this.http.get('https://kitchen-stories-app-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
      {
        params: new HttpParams().set('auth', this.userService.getUserToken())
      })
      .subscribe(prod => {
        this.convertProds(prod);
      }
      );
    return this.products;
  }

  converToUserData(obj: any) {
    this.userData = { cart: [], transaction: [] };
    for (let key in obj['cart']) {
      let abc = new Product(obj['cart'][key].pID, obj['cart'][key].productName, obj['cart'][key].productPrice, obj['cart'][key].productDescription, obj['cart'][key].productCategory, obj['cart'][key].url);
      abc.productQuantity = obj['cart'][key].productQuantity;
      if (obj['cart'].hasOwnProperty(key)) { this.userData.cart.push(abc); }
    }
    for (let key in obj['transaction']) {
      if (obj['transaction'].hasOwnProperty(key)) {
        let abc = new Product(obj['transaction'][key].pID, obj['transaction'][key].productName, obj['transaction'][key].productPrice, obj['transaction'][key].productDescription, obj['transaction'][key].productCategory, obj['transaction'][key].url) ;
        abc.productQuantity = obj['transaction'][key].productQuantity;
        abc.buyTime = obj['transaction'][key].buyTime;
        this.userData.transaction.push(abc);
      }
    }
    console.log(this.userData)
  }

  convertProds(obj: any) {
    this.products = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) { this.products.push(
        new Product(obj[key].pID, obj[key].productName, obj[key].productPrice, obj[key].productDescription, obj[key].productCategory, obj[key].url)
        ); }
    }
  }

  addUserDataToBack() {
    this.http.put('https://kitchen-stories-app-default-rtdb.asia-southeast1.firebasedatabase.app/Users/'
      + this.userService.getEmailId().split('.')[0]
      + '/userData.json',
      this.userData, {
      params: new HttpParams().set('auth', this.userService.getUserToken())
    }).subscribe(prod => {
      console.log(prod)
    })
  }

  fetchUserDataFromBack() {
    this.http.get('https://kitchen-stories-app-default-rtdb.asia-southeast1.firebasedatabase.app/Users/'
      + this.userService.getEmailId().split('.')[0]
      + '/userData.json', {
      params: new HttpParams().set('auth', this.userService.getUserToken())
    }).subscribe(prod => {
      if (prod == (null || undefined)) { console.log('No Data') } else { this.converToUserData(prod); }
    })
  }

  addProdToCart(pID: number) {
    let flagFound: boolean = false;
    if (this.userData.cart.length > 0) {
      for (let x of this.userData.cart) {
        if (pID === x.pID) {
          flagFound = true;
          x.productQuantity++;
        }
      }
    }
    if (!flagFound) {
      for (let y of this.products) {
        if (pID === y.pID) {
          this.userData.cart.push({...y})
        }
      }
    }
    this.addUserDataToBack();
    console.log(this.products)
  }

  buyProd(pID: number) {
    let date = new Date();
    for (let y of this.products) {
      if (pID === y.pID) {
        let prodTemp = { ...y }
        prodTemp.buyTime = date;
        this.userData.transaction.push(prodTemp);
      }
    }
    this.addUserDataToBack();
    console.log(this.products)
  }

  buyProdFromCart(pID: number) {
    let date = new Date();
    if (this.userData.cart.length > 0) {
      for (let x in this.userData.cart) {
        if (pID === this.userData.cart[x].pID) {
          let prodTemp = { ...this.userData.cart[x] };
          prodTemp.buyTime = date;
          prodTemp.productQuantity = this.userData.cart[x].productQuantity;
          this.userData.transaction.push(prodTemp);
          this.removeProdFromCart(pID);
        }
      }
    }console.log(this.products)
  }

  removeProdFromCart(pID: number) {
    if (this.userData.cart.length > 0) {
      for (let x in this.userData.cart) {
        if (pID === this.userData.cart[x].pID) {
          this.userData.cart.splice(+x, 1);
        }
      }
    }
    this.addUserDataToBack();
    console.log(this.products)
  }

  /* This is used to setup dummy products!!
    oneClickSetup() {
      products = [];
      this.products.push(new Product(1, 'Apple', 2.99, 'Juicy and Sweet!', 'Fruit'));
      this.products.push(new Product(2, 'Bananas', 2.49, 'Tasty and Nutricious!', 'Fruit'));
      this.products.push(new Product(3, 'Oranges', 3.99, 'Sweet and Sour!', 'Fruit'));
      this.products.push(new Product(4, 'Sweet Lime', 3.99, 'Sweet, Juicy and Sour!', 'Fruit'));
      this.products.push(new Product(5, 'Pineapple', 4.99, 'Juicy and Sour!', 'Fruit'));
      this.products.push(new Product(6, 'Kiwi', 3.99, 'Really Tasty!', 'Fruit'));
      this.products.push(new Product(7, 'Grapes', 2.99, 'Sweet, Juicy and really Tasty!', 'Fruit'));
  
      this.products.push(new Product(51, 'Tomatoes', 1.99, 'Juicy and Sour!', 'Vegetable'));
      this.products.push(new Product(52, 'Cucumber', 2.99, 'Juicy and really Nutricious!', 'Vegetable'));
      this.products.push(new Product(53, 'Carrots', 2.49, 'really Crunchy and Sweet!', 'Vegetable'));
      this.products.push(new Product(54, 'Onions', 3.99, 'real Tearjerkers!', 'Vegetable'));
      this.products.push(new Product(55, 'Raddish', 1.99, 'really Crunchy and Nutricious!', 'Vegetable'));
      this.products.push(new Product(56, 'Cabbage', 1.99, 'Juicy, Crunchy and Nutricious!', 'Vegetable'));
      this.products.push(new Product(57, 'Potatoes', 1.49, 'Nutricious and full of Carbs!', 'Vegetable'));
  
      this.http.put('https://kitchen-stories-app-default-rtdb.asia-southeast1.firebasedatabase.app/products.json',
      this.products, {
        params: new HttpParams().set('auth', this.userService.getUserToken())
      }).subscribe(prod => {
        console.log(prod);
      })
    }
  */
}
