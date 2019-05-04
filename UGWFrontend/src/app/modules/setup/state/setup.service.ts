import {Injectable} from '@angular/core';
import {AvailableKurseMap, SetupStore} from './setup.store';
import {Kurs, Kurse} from '../../../../types/Kurs';
import {SetupQuery} from './setup.query';
import {serviceInCypress} from '../../../util';

@Injectable()
export class SetupService {
  constructor(private store: SetupStore, protected query: SetupQuery) {
    serviceInCypress(this);
  }
  lockName(name: string) {
    this.store.update({name});
  }
  setAvailStufen(stufen: string[]) {
    this.store.update({available_stufen: stufen});
  }
  setStufe(stufe: string) {
    this.store.update({stufe});
  }
  setAvailableKurse(kurse: Kurse) {
    // sort array based on title field, where LKs are higher up than GKs
    kurse = kurse.sort((a: Kurs, b: Kurs) => {
      const AisLK = /^LK/.test(a.title);
      const BisLK = /^LK/.test(b.title);
      if (AisLK && !BisLK) {
        return -1;
      } else if (BisLK && !AisLK) {
        return 1;
      } else {
        return (a.title > b.title) ? 1 : ((a.title === b.title) ? 0 : -1);
      }
    });

    // convert to object

    // tslint:disable-next-line:variable-name
    const available_kurse: AvailableKurseMap = {};
    kurse.forEach((k: Kurs) => {
      if (!available_kurse[k.title]) {
        available_kurse[k.title] = [k];
      } else {
        available_kurse[k.title].push(k);
      }
    });

    // add FREI Kurs
    for (const key of Object.keys(available_kurse)) {
      available_kurse[key] = [{fach: 'Frei', lehrer: '', title: key}, ...available_kurse[key]];
    }

    // generate default indexes

    // tslint:disable-next-line:variable-name
    const selected_kurse_indexes = {};
    for (const key of Object.keys(available_kurse)) {
      selected_kurse_indexes[key] = -1;
    }
    this.store.update({available_kurse, selected_kurse_indexes});
  }

  changeSelectedStufeIndex(title: string, index: number) {
    const obj = Object.assign({}, this.query.getValue().selected_kurse_indexes);
    obj[title] = index;
    this.store.update({selected_kurse_indexes: obj});
  }


}

