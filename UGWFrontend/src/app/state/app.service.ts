import {Injectable} from '@angular/core';
import {AppState, AppStore, VertretungsDatum, VertretungsPlanSeite} from './app.store';
import {AppQuery} from './app.query';
import {LoginResponse} from '../modules/setup/login/login.service';
import {serviceInCypress} from '../util';
import {Kurse} from 'src/types/Kurs';
import {TimeTable} from '../../types/TT';

@Injectable()
export class AppService {
  constructor(private store: AppStore, private query: AppQuery) {
    serviceInCypress(this);
  }
  changeMenuState() {
    this.store.update({menuOpen: !this.query.getValue().menuOpen});
  }
  onLogin(loginData: LoginResponse) {

    const provider = loginData.data.claim.provider;
    console.log(loginData);

    if (!!provider.find((val) => val === 'normal')) {
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

    if (!!provider.find((val) => val === 'google')) {
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



    if (!!provider.find((val) => val === 'insta')) {
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

    this.save();
  }

  addCreds(token: string) {
    const claim = JSON.parse(atob(token.split('.')[1]));
    this.store.update({
      credentials: {
        token,
        has_lehrer: !!claim.lehrer
      }
    });
    this.save();
  }

  setKurseStufeStundenplan(kurse: Kurse, stufe: string, sp: TimeTable) {
    this.store.update({
      basics: {
        stufe,
        stufe_id: null,
        kurse,
        stundenplan: sp,
        stundenplanWithInfos: sp,
        vertretungsplan: null
      }
    });
    this.save();
  }

  setVertretungsplan(vp: VertretungsPlanSeite[]) {
    const refDate = new Date(); // we use this to copy the 'year' information. No need to worry about new years eve b/c of holidays
    const basics = Object.assign({}, this.query.getValue().basics);
    let newPlan: TimeTable;
    if (!!this.query.getValue().basics.stundenplanWithInfos) {
      newPlan = JSON.parse(JSON.stringify(this.query.getValue().basics.stundenplanWithInfos));
    } else {
      newPlan = JSON.parse(JSON.stringify(this.query.getValue().basics.stundenplan));
    }
    basics.vertretungsplan = vp;
    // Write VD into SPwithInfos
    basics.vertretungsplan.forEach((day: VertretungsPlanSeite) => {
      if (day.vp !== null) {
        day.vp.forEach((datum: VertretungsDatum) => {
          if (datum.stunde.match('-')) {
            return;
          }
          const dateSplit = datum.date.split('.');
          const asDate = new Date(refDate.getFullYear(), +dateSplit[1] - 1, +dateSplit[0], 8 );
          const index = asDate.getDay() - 1;
          const abIndex = AppQuery.getWeekNumber(asDate) [1] % 2 === 0 ? 0 : 1;
          if (newPlan[abIndex][index][+datum.stunde - 1].name === datum.fach) {
            newPlan[abIndex][index][+datum.stunde - 1].vd = datum;
          }
        });
      }
    });
    basics.stundenplanWithInfos = newPlan;
    this.store.update({
      basics
    });
  }

  private save() {
    const obj: AppState = JSON.parse(JSON.stringify(this.query.getValue()));
    if (obj.basics) {
      delete obj.basics.vertretungsplan;
    }
    delete obj.nextDay;
    delete obj.thisDay;
    delete obj.menuOpen;
    localStorage.app_state = JSON.stringify(obj);
  }
}
