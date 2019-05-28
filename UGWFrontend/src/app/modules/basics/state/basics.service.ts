import {Injectable} from '@angular/core';
import {BasicsStore} from './basics.store';

@Injectable()
export class BasicsService {

  constructor(private store: BasicsStore) { }

  set showPopup(value: boolean) {
    this.store.update({
      showPopup: value
    });
  }
}
