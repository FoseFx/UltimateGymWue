import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {SwPush} from '@angular/service-worker';

@Injectable()
export class NotificationService {

  navRef = navigator;
  windowRef = window;
  constructor(public swPush: SwPush) {}

  hasSW() {
    return !!this.navRef.serviceWorker;
  }

  canPush() {
    return !!this.windowRef.PushManager;
  }

  async subscribeToPush() {
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.pushPublicKey
      });
      // todo send to server
    } catch (e) {
      console.error('Could not subscribe', e);
    }
  }

}
