import {Injectable} from '@angular/core';
import {AppStore} from './app.store';
import {AppQuery} from './app.query';

@Injectable()
export class AppService {
  constructor(private store: AppStore, private query: AppQuery) {
  }
  changeMenuState() {
    this.store.update({menuOpen: !this.query.getValue().menuOpen});
  }
}
