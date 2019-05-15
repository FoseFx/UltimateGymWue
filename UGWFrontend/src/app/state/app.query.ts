//
// The App Store should only
// keep absolutely needed information
//

import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {AppState, AppStore} from './app.store';
import {map} from 'rxjs/operators';
import {queryInCypress} from '../util';
import {Observable} from 'rxjs';

@Injectable()
export class AppQuery extends Query<AppState> {
  constructor(protected store: AppStore) {
    super(store);
    queryInCypress(this);
  }
  get loginToken() {
    return `Bearer ${this.getValue().loginData.token}`;
  }
  get credentialsToken() {
    return `Bearer ${this.getValue().credentials.token}`;
  }
  menuOpen$ = this.select('menuOpen');
  tt$ = this.select('basics').pipe(map((b) => b.stundenplan));

  isLoginned$ = this.select('loginData').pipe(map(d => !!d));

  today$: Observable<Date> = this.select('thisDay').pipe(
    map((day) => {
      if (day !== null) {
        return day;
      }
      let today = new Date();

      today = this._toNextDay(today);

      this.store.update({thisDay: today});
      return today;
    })
  );


  nextDay$: Observable<Date> = this.select('nextDay').pipe(
    map((d) => {
      if (d !== null) {
        return d;
      }
      let day = new Date();
      day = this._toNextDay(day, false);
      day = new Date(day.setTime( day.getTime() + 86400000 )); // add at least one day

      this.store.update({nextDay: day});
      return day;
    })
  );


  _toNextDay(day, allowFriday = true): Date {
    // 0 1 2 3 4 5 6
    // S M T W T F S
    const wasFriday = day.getDay() === 5;
    while (day.getDay() === 0 || day.getDay() === 6 || (!allowFriday && day.getDay() === 5)) { // skip to next school day
      day = new Date(day.setTime( day.getTime() + 86400000 ));
    }
    if (!allowFriday && wasFriday) {
      day = new Date(day.setTime( day.getTime() - 86400000 )); // remove one day again, because in nextDay$ it will be added
    }
    return day;
  }

  hasCredentials = () => this.getValue().credentials !== null;

}
