import {Injectable} from '@angular/core';
import {AvailableKurseMap, SetupStore} from './setup.store';
import {Kurs, Kurse} from "../../../../types/Kurs";

@Injectable()
export class SetupService {
  constructor(private store: SetupStore) {
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
    // tslint:disable-next-line:variable-name
    const available_kurse: AvailableKurseMap = {};
    kurse.forEach((k: Kurs) => {
      if (!available_kurse[k.title]) {
        available_kurse[k.title] = [k];
      } else {
        available_kurse[k.title].push(k);
      }
    });
    this.store.update({available_kurse});
  }
}
