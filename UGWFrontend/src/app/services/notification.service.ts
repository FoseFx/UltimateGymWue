import {Injectable, Optional} from '@angular/core';
import {environment} from '../../environments/environment';
import {SwPush} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';
import {AppQuery} from '../state/app.query';

@Injectable()
export class NotificationService {

  navRef = navigator;
  windowRef = window;
  subscription: PushSubscription = null;
  constructor(@Optional() public swPush: SwPush, public http: HttpClient, public appQuery: AppQuery) {
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
    if (!this.canPush()) {return false; }
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.pushPublicKey
      });
      const resp = await this.http.post(environment.urls.newPushSub, sub.toJSON(), {
        headers: {
          Authorization: this.appQuery.loginToken,
          'X-GW-Auth': this.appQuery.credentialsToken
        }
      }).toPromise();
      return true;
    } catch (e) {
      console.error('Could not subscribe', e);
      return false;
    }
  }

}
