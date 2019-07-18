import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {SnackbarService} from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class HasNetworkService {

  public isOnline$: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);

  public get isOnline(): boolean {
    return this.isOnline$.value;
  }

  constructor(public snackbarService: SnackbarService) {
    fromEvent(window, 'online').subscribe(() => {
      this.isOnline$.next(true);
      this.snackbarService.addSnackbar('Internetverbindung wiederaufgenommen', 3000);
    });
    fromEvent(window, 'offline').subscribe(() => {
      this.isOnline$.next(false);
      this.snackbarService.addSnackbar('Internetverbindung verloren', 3000, 'alert');
    });
  }


}
