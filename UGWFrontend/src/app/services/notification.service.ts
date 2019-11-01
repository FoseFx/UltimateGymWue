import {Injectable, Optional} from '@angular/core';
import {environment} from '../../environments/environment';
import {SwPush} from '@angular/service-worker';
import {AppQuery} from '../state/app.query';
import {SnackbarService} from './snackbar.service';

@Injectable()
export class NotificationService {

  navRef = navigator;
  windowRef = window;
  subscription: PushSubscription = null;
  constructor(@Optional() public swPush: SwPush,
              public appQuery: AppQuery,
              public snackbar: SnackbarService) {
    if (this.swPush) {
      this.swPush.subscription.subscribe((subs: PushSubscription) => {
        this.subscription = subs;
      });
    }
  }

  hasSW() {
    return !!this.navRef.serviceWorker;
  }

  canPush() {
    return !!this.windowRef.PushManager;
  }

  isSubscribed() {
    return this.subscription !== null;
  }

  async subscribeToPush() {
    return false;
  }

}
