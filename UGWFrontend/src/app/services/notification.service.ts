import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  navRef = navigator;
  windowRef = window;
  constructor() {}

  hasSW() {
    return !!this.navRef.serviceWorker;
  }

  canPush() {
    return !!this.windowRef.PushManager;
  }

  async getSWReg(): Promise<ServiceWorkerRegistration> {
    if (this.hasSW()) {
      return this.navRef.serviceWorker.getRegistration();
    }
    return null;
  }

  async getPushManager(): Promise<PushManager> {
    const swr = await this.getSWReg();
    if (swr === null) {
      return null;
    }
    return swr.pushManager;
  }

  async subscribeToPush() {
    const pm = await this.getPushManager();
    const sub = await pm.subscribe({
      userVisibleOnly: true
    });
    console.log(sub);
  }

}
