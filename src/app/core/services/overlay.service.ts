import { Injectable, QueryList, ViewChildren } from '@angular/core';
import {
  ActionSheetController,
  IonRouterOutlet,
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  @ViewChildren(IonRouterOutlet) routerOutlets?: QueryList<IonRouterOutlet>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private menu: MenuController
  ) {}
  async closeAllOverlays() {
    try {
      const element = await this.actionSheetCtrl.getTop();
      if (element) {
        element.dismiss();
        return;
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const element = await this.popoverCtrl.getTop();
      if (element) {
        element.dismiss();
        return;
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const element = await this.modalCtrl.getTop();
      if (element) {
        element.dismiss();
        return;
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const element = await this.menu.getOpen();
      if (element !== null) {
        this.menu.close();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
