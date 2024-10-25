import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,IonToastCustomEvent,OverlayEventDetail } from '@ionic/core';
import { ScannerService } from '../services/scanner.service';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../interface/state';
import { DataState } from '../enum/dataState.enum';
import { CustomHttpResponse, ProductState } from '../interface/appState';

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
  
  constructor(private scannerService: ScannerService) {}
  
  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }
  
  confirm() {
    this.isLoading = true;
    
    this.productState$ = this.scannerService.$product("666600").pipe(
      map(response => {
        this.dataSubject.next(response);
        console.log(response.data);
        setTimeout(() => { 
          this.isLoading = false;
          this.isModalOpen = true
        }, 4000)
        //this.isLoading = false;
        
        return { dataState: DataState.LOADED, appData: response};
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        console.log(error);
        setTimeout(() => { 
          this.isLoading = false;
        }, 4000)
        //this.isLoading = false;
        return of({ dataState: DataState.ERROR, error: error });
      })
    )
    //     .subscribe(result => {
    //   console.log(result);
    //   //this.productState$ = result.dataState;
    // });

    console.log(this.productState$.subscribe(result=> console.log(result)));

    
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


}
