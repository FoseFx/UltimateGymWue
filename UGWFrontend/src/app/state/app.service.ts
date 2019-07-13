import {Injectable} from '@angular/core';
import {AppState, AppStore, AppStoreBasics, VertretungsDatum, VertretungsPlanSeite} from './app.store';
import {AppQuery} from './app.query';
import {LoginResponse} from '../modules/setup/login/login.service';
import {serviceInCypress} from '../util';
import {Kurse} from 'src/types/Kurs';
import {TimeTable} from '../../types/TT';

const keysToSave = ['loginData', 'fullname', 'basics', 'klausuren', 'credentials'];

@Injectable()
export class AppService {
  constructor(public store: AppStore, public query: AppQuery) {
    serviceInCypress(this);
  }
  changeMenuState() {
    this.store.update({menuOpen: !this.query.getValue().menuOpen});
  }
  onLogin(loginData: LoginResponse) {

    const provider = getProvider(loginData);

    if (isNormal(loginData)) {
      this.store.update({
        loginData: {
          uid: loginData.data.claim.uid,
          token: loginData.data.token,
          provider,
          google: null,
          insta: null,
          normal: {
            email: loginData.data.claim.normal.email,
            email_verified: loginData.data.claim.normal.email_verified,
          }
        }
      });
    }

    if (isGoogle(loginData)) {
      this.store.update({
        loginData: {
          uid: loginData.data.claim.uid,
          token: loginData.data.token,
          provider,
          normal: null,
          insta: null,
          google: loginData.data.claim.google
        }
      });
    }



    if (isInsta(loginData)) {
      this.store.update({
        loginData: {
          uid: loginData.data.claim.uid,
          token: loginData.data.token,
          provider,
          normal: null,
          google: null,
          insta: loginData.data.claim.insta
        }
      });
    }


    this.store.update({
      fullname: loginData.data.claim.fullname
    });

    this._save();
  }

  addCreds(token: string) {
    this.store.update({
      credentials: {
        token,
        has_lehrer: tokenHasLehrer(token)
      }
    });
    this._save();
  }

  setKurseStufeStundenplan(kurse: Kurse, stufe: string, sp: TimeTable) {
    this.store.update({
      basics: {
        stufe,
        stufe_id: null,
        kurse,
        stundenplan: sp,
        stundenplanWithInfos: sp,
        vertretungsplan: null,
        hiddenNonKurse: []
      }
    });
    this._save();
  }

  setVertretungsplan(vp: VertretungsPlanSeite[]) {
    const weights = {
      'raum-vtr.': 0,
      v: 1,
      e: 2,
      eva: 2,
      k: 3
    };
    const basics = this._getMutableBasicObject();
    // old information gets discarded
    const newPlan: TimeTable = JSON.parse(JSON.stringify(basics.stundenplan));
    basics.vertretungsplan = vp;
    // Write VD into SPwithInfos
    basics.vertretungsplan.forEach((day: VertretungsPlanSeite) => {
      if (day.vp !== null) {
        day.vp.forEach((datum: VertretungsDatum) => {
          if (datum.stunde.match('-')) {
            return;
          }
          const {index, abIndex} = dateSplitToDayOfWeekAndABWoche(datum.date);
          if (newPlan[abIndex][index][+datum.stunde - 1].name === datum.fach || this._isMyKlausur(datum)) {
            if (!newPlan[abIndex][index][+datum.stunde - 1].vd) { // set if empty
              newPlan[abIndex][index][+datum.stunde - 1].vd = datum;
            } else { // check for replacement
              const currentType  = newPlan[abIndex][index][+datum.stunde - 1].vd.typ;
              if (weights[currentType] < weights[datum.typ]) { // replace
                newPlan[abIndex][index][+datum.stunde - 1].vd = datum;
              }
            }
          }
        });
      }
    });
    basics.stundenplanWithInfos = newPlan;
    this.store.update({
      basics
    });
  }


  public setKlausuren(klausuren: string[]) {
    this.store.update({
      klausuren
    });
    this._save();
  }

  public hideNonKurs(kurs: string) {
    const basics = this._getMutableBasicObject();
    const hiddenNonKurse = basics.hiddenNonKurse;
    basics.hiddenNonKurse = [kurs, ...(!!hiddenNonKurse ? hiddenNonKurse : [])];
    this.store.update({
      basics
    });
    this._save();
  }
  public unHideNonKurse(kurs: string) {
    const basics = this._getMutableBasicObject();
    const hiddenNonKurse = basics.hiddenNonKurse;
    basics.hiddenNonKurse = [...(!!hiddenNonKurse ? hiddenNonKurse : [])];
    basics.hiddenNonKurse = basics.hiddenNonKurse.filter(s => s !== kurs);
    this.store.update({
      basics
    });
    this._save();
  }

  _getMutableBasicObject(): AppStoreBasics {
    return JSON.parse(JSON.stringify(this.query.getValue().basics));
  }

  _isMyKlausur(datum: VertretungsDatum): boolean {
    if (datum.typ !== 'k') {
      return false;
    }
    return !!this.query.getValue().klausuren.find(f => {
      const possible = datum.info.match(/\w+\d*/g);
      if (possible === null) {
        return false;
      }
      return !!possible.find(p => f === p);
    });
  }

  _save() {
    const value = this.query.getValue();
    const obj: any = {};
    keysToSave.forEach((key: string) => {
      if (value.hasOwnProperty(key)) {
        obj[key] = JSON.parse(JSON.stringify(value[key]));
      }
    });
    if (obj.basics) {
      delete obj.basics.stundenplanWithInfos;
      delete obj.basics.vertretungsplan;
    }
    localStorage.setItem('app_state', JSON.stringify(obj));
  }
}

export function getProvider(resp: LoginResponse): ('google'|'insta'|'normal')[] {
  return resp.data.claim.provider;
}

export function isNormal(resp: LoginResponse): boolean {
  const provider = getProvider(resp);
  return !!provider.find((val) => val === 'normal');
  }
export function isGoogle(resp: LoginResponse): boolean {
  const provider = getProvider(resp);
  return !!provider.find((val) => val === 'google');

}
export function isInsta(resp: LoginResponse): boolean {
  const provider = getProvider(resp);
  return !!provider.find((val) => val === 'insta');
}

export function tokenHasLehrer(token: string): boolean {
  const claim = JSON.parse(atob(token.split('.')[1]));
  return !!claim.lehrer;
}
export function getCurrentYear(): number {
  const refDate = new Date();
  return refDate.getFullYear();
}
export function dateSplitToDayOfWeekAndABWoche(dateStr: string): {index: number, abIndex: number} {
  const split = dateStr.split('.');
  const date = new Date(getCurrentYear(), +split[1] - 1, +split[0], 8); // this year at dd.mm. at 8 am
  const abWocheIndex = AppQuery.getWeekNumber(date)[1] % 2 === 0 ? 0 : 1;
  console.log(dateStr, abWocheIndex);
  return {index: date.getDay() - 1, abIndex: abWocheIndex};
}
