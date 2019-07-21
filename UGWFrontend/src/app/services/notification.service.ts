import {Injectable, Optional} from '@angular/core';
import {environment} from '../../environments/environment';
import {SwPush} from '@angular/service-worker';

@Injectable()
export class NotificationService {

  navRef = navigator;
  windowRef = window;
  subscription: PushSubscription = null;
  constructor(@Optional() public swPush: SwPush) {
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
    if (!this.canPush()) {return false;}
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.pushPublicKey
      });
      // todo send to server
      return true;
    } catch (e) {
      console.error('Could not subscribe', e);
      return false;
    }
  }

}
