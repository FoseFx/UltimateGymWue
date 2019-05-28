import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasNetworkService {

  public isOnline$: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);

  public get isOnline(): boolean {
    return this.isOnline$.value;
  }

  constructor() {
    fromEvent(window, 'online').subscribe(() => {
      this.isOnline$.next(true);
    });
    fromEvent(window, 'offline').subscribe(() => {
      this.isOnline$.next(false);
    });
  }


}
