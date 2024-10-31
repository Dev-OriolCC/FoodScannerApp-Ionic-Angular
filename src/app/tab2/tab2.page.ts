import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Product } from '../interface/product';
import { doc } from '@angular/fire/firestore';
import { ProductState } from '../interface/appState';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import { DataState } from '../enum/dataState.enum';
import { State } from '../interface/state';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  products: Product[] = []
  productImages: { condition: boolean | undefined; src: string; alt: string; }[] | undefined;

  private productSubject = new BehaviorSubject<State<Product | null> | null>(null);
  productState$ = this.productSubject.asObservable();

  readonly DataState = DataState

  isModalOpen: boolean = false;
  isLoading: boolean = true;
  skeletonItems = Array(4);


  constructor(private databaseService: DatabaseService, private alertController: AlertController) {
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true;
    
    this.databaseService.getCollectionChanges<Product>("Products").subscribe(resp => {
      if(resp) {
        console.log(resp)
        this.products = resp
        this.isLoading = false
      }
    })
  }

  viewProduct(productId: string) {
    const product = this.products.find(p => p.id === productId)
    this.productImages = [
      { condition: product?.isCalories, src: '../../assets/stickers/calories.png', alt: 'Excessive Calories' },
      { condition: product?.isSugars, src: '../../assets/stickers/sugars.png', alt: 'Excessive Sugars' },
      { condition: product?.isSaturatedFat, src: '../../assets/stickers/saturated.png', alt: 'Excessive Saturated Fat' },
      { condition: product?.isSalt, src: '../../assets/stickers/salt.png', alt: 'Excessive Salt' }
    ].filter(img => img.condition);
    this.isModalOpen = true
    this.productSubject.next({ dataState: DataState.LOADED, appData: product });
  }

  closeModal(isOpen: boolean) {
    console.log('closeModal....')
    this.isModalOpen = isOpen
  }

  /**
   * Delete Logic
   * @param product 
   */
  deleteProduct(product: Product) {
    console.log("Deleting: "+product.id)
    this.databaseService.deleteDocument("Products", product.id)
  }
  
  showDeleteAlert(product: Product) {
    console.log('Show delete alert'+product.id)
    /** Alert delete button */
    this.alertController.create({ 
      header: `Are you sure you want to delete this product: ${product.productName} ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('Delete canceled'); },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { console.log('Delete confirmed'); },
        },
      ]
    }).then(alert => alert.present());
  }

}
