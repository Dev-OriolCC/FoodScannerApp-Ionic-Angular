import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,IonToastCustomEvent,OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  @ViewChild(IonModal) modal: IonModal | undefined;
  
  constructor() {}
  
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string | undefined;
  
  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }
  
  confirm() {
    this.modal?.dismiss(this.name, 'confirm');
    // Loading
    // Show result message and tags
  }
  
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
      console.log(ev.detail.data)
    }
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
