//
// The App Store should only
// keep absolutely needed information
//

import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {AppState, AppStore} from './app.store';
import {map} from 'rxjs/operators';

@Injectable()
export class AppQuery extends Query<AppState> {
  constructor(protected store: AppStore) {
    super(store);
  }
  menuOpen$ = this.select('menuOpen');
  isLoginned$ = this.select('loginData').pipe(map(d => !!d));
}
