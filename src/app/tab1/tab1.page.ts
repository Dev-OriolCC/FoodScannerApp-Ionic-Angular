import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,IonToastCustomEvent,OverlayEventDetail } from '@ionic/core';
import { ScannerService } from '../services/scanner.service';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../interface/state';
import { DataState } from '../enum/dataState.enum';
import { CustomHttpResponse, ProductState } from '../interface/appState';
import { DatabaseService } from '../services/database.service';
import { Product } from '../interface/product';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  /** 
  * @TODO add color binding depending on the API value                     
  * [ngClass]="{'green-text': caloriesValue === 'NO', 'red-text': caloriesValue === 'YES'}"
  */

  isModalOpen = false
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string | undefined;
  isLoading: boolean = false;

  productState$!: Observable<State<CustomHttpResponse<ProductState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<ProductState> | null>(null);

  readonly DataState = DataState
  
  @ViewChild(IonModal) modal: IonModal | undefined;

  productImages: { condition: boolean | undefined; src: string; alt: string; }[] | undefined;
  constructor(private scannerService: ScannerService, private databaseService: DatabaseService) {}
  
  cancel() {
    this.name = ""
    this.modal?.dismiss(null, 'cancel');
  }
  
  confirm() {
    this.isLoading = true;

    this.productState$ = this.scannerService.$product(this.name != undefined ? this.name : "").pipe(
      map(response => {
        this.dataSubject.next(response);
        console.log(response.data);
        this.productImages = [
          { condition: response.data?.product?.isCalories, src: '../../assets/stickers/calories.png', alt: 'Excessive Calories' },
          { condition: response.data?.product?.isSugars, src: '../../assets/stickers/sugars.png', alt: 'Excessive Sugars' },
          { condition: response.data?.product?.isSaturatedFat, src: '../../assets/stickers/saturated.png', alt: 'Excessive Saturated Fat' },
          { condition: response.data?.product?.isSalt, src: '../../assets/stickers/salt.png', alt: 'Excessive Salt' }
        ].filter(img => img.condition);
        
        this.isLoading = false;
        this.isModalOpen = true
        if(response.data?.product != undefined) {
          this.createProduct(response.data?.product)
        }
        
        return { dataState: DataState.LOADED, appData: response};
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        console.log("[CATCH ERROR]: "+error);
        setTimeout(() => {
          this.isLoading = false;
        }, 2000)
        return of({ dataState: DataState.ERROR, error: error });
      })
    )
  }

  createProduct(data : Product) {
    this.databaseService.createDocument("Products", data.id, data)
  }

  

  
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'showResult') {
      this.message = `Hello, ${ev.detail.data}!`;
      console.log("DATA => "+ev.detail.data)
    }
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  
  /** Second Modal */
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // Toast
  public toastButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        console.log('Dismiss clicked');
      },
    },
  ];
  
  setRoleMessage($event: IonToastCustomEvent<OverlayEventDetail<any>>) {
    throw new Error('Method not implemented.');
  }

  public toastErrorButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        console.log('Dismiss clicked');
      },
    },
  ];

  setErrorMessage($event: IonToastCustomEvent<OverlayEventDetail<any>>) {
    throw new Error('Method not implemented.');
  }


}
