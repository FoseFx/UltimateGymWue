import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {SetupState, SetupStore} from './setup.store';

@Injectable()
export class SetupQuery extends Query<SetupState> {
  constructor(protected store: SetupStore) {
    super(store);
  }
  selectName$ = this.select('name');

  availStufen$ = this.select('available_stufen');
}
