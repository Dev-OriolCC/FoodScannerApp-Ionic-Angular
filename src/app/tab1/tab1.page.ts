import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,IonToastCustomEvent,OverlayEventDetail } from '@ionic/core';
import { ScannerService } from '../services/scanner.service';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../interface/state';
import { DataState } from '../enum/dataState.enum';
import { CustomHttpResponse, ProductState } from '../interface/appState';
import { DatabaseService } from '../services/database.service';
import { Product } from '../interface/product';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

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
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private scannerService: ScannerService, private databaseService: DatabaseService, private alertController: AlertController) {}

  ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  /** Scan barcode */
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }

    try {
      const result = await BarcodeScanner.scan();

      if(result.barcodes && result.barcodes.length > 0) {
        this.name = result.barcodes[0].displayValue || "";
      } else {
        console.log("No barcode found")
      }

    } catch (error) {
      console.log("[ERROR]: "+error);
    }
    // const { barcodes } = await BarcodeScanner.scan();
    // this.barcodes.push(...barcodes);
    // this.name = this.barcodes.at(0)
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  /** */
  
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
