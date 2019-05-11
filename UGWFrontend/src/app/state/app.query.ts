//
// The App Store should only
// keep absolutely needed information
//

import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {AppState, AppStore} from './app.store';
import {map} from 'rxjs/operators';
import {queryInCypress} from '../util';

@Injectable()
export class AppQuery extends Query<AppState> {
  constructor(protected store: AppStore) {
    super(store);
    queryInCypress(this);
  }
  menuOpen$ = this.select('menuOpen');
  tt$ = this.select('basics').pipe(map((b) => b.stundenplan));

  isLoginned$ = this.select('loginData').pipe(map(d => !!d));
  hasCredentials = () => this.getValue().credentials !== null;
  get loginToken() {
    return `Bearer ${this.getValue().loginData.token}`;
  }
  get credentialsToken() {
    return `Bearer ${this.getValue().credentials.token}`;
  }
}
