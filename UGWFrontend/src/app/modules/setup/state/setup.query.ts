import {Query} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {SelectedKurseIndexMap, SetupState, SetupStore} from './setup.store';
import {map} from 'rxjs/operators';
import {Kurse} from '../../../../types/Kurs';
import {queryInCypress} from '../../../util';

@Injectable()
export class SetupQuery extends Query<SetupState> {
  constructor(protected store: SetupStore) {
    super(store);
    queryInCypress(this);
  }
  selectName$ = this.select('name');

  availStufen$ = this.select('available_stufen');

  stufe$ = this.select('stufe');

  availKurse$ = this.select('available_kurse');

  selectedKurseIndexes$ = this.select('selected_kurse_indexes');

  hasSelectedAllKurse$ = this.select('selected_kurse_indexes').pipe(map(hasSelAllKurse));

  noSelectedKurse$ = this.select('selected_kurse_indexes').pipe(map(val => {
    const arr: string[] = [];
    for (const i in val) {
      if (val[i] === -1) {
        arr.push(i);
      }
    }
    return arr;
  }));

  getStufe(): string {
    return this.getValue().stufe;
  }

  getHasSelectedAllKurse() {
    return hasSelAllKurse(this.getValue().selected_kurse_indexes);
  }

  getSelectedKurse(): Kurse {
    const ind = this.getValue().selected_kurse_indexes;
    const arr: Kurse = [];
    for (const key in ind) {
      if (!ind.hasOwnProperty(key)) { continue; }
      arr.push(this.getValue().available_kurse[key][ind[key]]);
    }
    return arr;
  }
}

export function hasSelAllKurse(val: SelectedKurseIndexMap): boolean {
  let ok = true;
  for (const i in val) {
    if (!val.hasOwnProperty(i)) { continue; }
    if (val[i] === -1) {
      ok = false;
    }
  }
  return ok;
}

