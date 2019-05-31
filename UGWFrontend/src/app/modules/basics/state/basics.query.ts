import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {BasicsState, BasicsStore} from './basics.store';
import {Observable} from 'rxjs';

@Injectable()
export class BasicsQuery extends Query<BasicsState> {

  constructor(protected store: BasicsStore) {
    super(store);
  }

  showPopup$: Observable<boolean> = this.select('showPopup');

  popupData$ = this.select('popupData');
}
