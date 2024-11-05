import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor() {
    this.showSplashScreen();
  }

  async showSplashScreen() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000
    });
  }

}
