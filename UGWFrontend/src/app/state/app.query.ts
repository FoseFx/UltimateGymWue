//
// The App Store should only
// keep absolutely needed information
//

import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {AppState, AppStore, AppStoreBasics, VertretungsPlanSeite} from './app.store';
import {flatMap, map} from 'rxjs/operators';
import {queryInCypress} from '../util';
import {Observable} from 'rxjs';
import {TimeTable} from '../../types/TT';

@Injectable()
export class AppQuery extends Query<AppState> {
  constructor(protected store: AppStore) {
    super(store);
    queryInCypress(this);
  }
  get version() {
    return this.getValue().meta.version;
  }
  get loginToken() {
    return `Bearer ${this.getValue().loginData.token}`;
  }
  get credentialsToken() {
    return `Bearer ${this.getValue().credentials.token}`;
  }


  menuOpen$ = this.select('menuOpen');
  public tt$ = this.select('basics').pipe(
    basicStunenplanMap(),
    mixInHiddenNonKurse(this.select('basics')),
    removeHiddenNonKurse()
  );

  hiddenNonKurse$: Observable<string[]> = this.select('basics').pipe(basicHiddenNonKurseMap());
  
  fetchedAt$: Observable<Date> = this.select('basics').pipe(map((b) => !!b ? b.vdFetchedAt : null));

  stufe$ = this.select('basics').pipe(map((d) => d.stufe));


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

  abwoche$: Observable<0|1> = this.today$.pipe(abwochemap());

  nextDayABwoche$: Observable<0|1> = this.nextDay$.pipe(abwochemap());

  vertretungsDaten$: Observable<VertretungsPlanSeite[]> = this.select('basics').pipe(basicVertretungsDatenMap());

  /** credit: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889 */
  public static getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(( ( (d - (yearStart as any)) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
  }

  isLoginned = () => !!this.getValue().loginData;

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
// tslint:disable-next-line:no-shadowed-variable
export const abwochemap = () => map((date: Date) => (AppQuery.getWeekNumber(date)[1] % 2 === 0) ? 0 : 1);

export const removeHiddenNonKurse = () => map((arr: [TimeTable, string[]]) => {
  const tt = JSON.parse(JSON.stringify(arr[0]));
  arr[1].forEach((kurs: string) => {
    tt.forEach((woche) =>
      woche.forEach((tag) =>
        tag.forEach((stunde, i) => {
          if (stunde.typ === 'klasse' && stunde.name === kurs) {
            tag[i] = {};
          }
        })
      )
    );
  });
  return tt;
});

export const mixInHiddenNonKurse =
  (basics$: Observable<{hiddenNonKurse: string[]}>) =>
    flatMap(
      tt => basics$.pipe(
          map(b => !!b ? [tt, (!!b.hiddenNonKurse ? b.hiddenNonKurse : [])] : [tt, []])
        )
    );
export const basicStunenplanMap = () => map(
  (b: AppStoreBasics) => !!b ? (!!b.stundenplanWithInfos ? b.stundenplanWithInfos : b.stundenplan) : []
);

export const basicHiddenNonKurseMap = () => map(
  (b: AppStoreBasics) => !!b ? b.hiddenNonKurse : []
);

export const basicVertretungsDatenMap = () => map(
  (b: AppStoreBasics) => !!b.vertretungsplan ? b.vertretungsplan : [null, null]
);

