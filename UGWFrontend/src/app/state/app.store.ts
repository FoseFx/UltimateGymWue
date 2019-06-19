//
// The App Store should only
// keep absolutely needed information
//

import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Kurse} from 'src/types/Kurs';
import {TimeTable} from '../../types/TT';

export class LoginData {
  token: string;
  uid: string;
  provider: ('normal'|'google'|'insta')[];
  normal: {
    email: string,
    email_verified: boolean
  };
  google: {
    email: string,
    gid: string
  };
  insta: {
    iid: string,
    token: string
  };
}

export interface AppState {
  meta: {
    version: string;
  };
  loginData: LoginData;
  fullname: string;
  basics: {
    stufe: string,
    stufe_id: string,
    kurse: Kurse,
    stundenplan: TimeTable,
    stundenplanWithInfos: TimeTable
    vertretungsplan: VertretungsPlanSeite[],
    hiddenNonKurse: string[]
  };
  klausuren: string[];
  menuOpen: boolean;
  credentials: {
    token: string,
    has_lehrer: boolean
  };
  thisDay: Date;
  nextDay: Date;
}

export function createInitialState(): AppState {
  if (!!localStorage.app_state) {
    const storage: AppState = JSON.parse(localStorage.app_state);
    storage.nextDay = null;
    storage.thisDay = null;
    storage.menuOpen = false;
    return storage;
  }
  return {
    meta: {
      version: '0.0.1'
    },
    fullname: null,
    loginData: null,
    menuOpen: false,
    basics: null,
    credentials: null,
    thisDay: null,
    nextDay: null,
    klausuren: []
  };
}

@StoreConfig({name: 'AppStore'})
@Injectable()
export class AppStore extends Store<AppState> {

  constructor() {
    super(createInitialState());
  }

}


export class VertretungsDatum {
  date: string;
  fach: string;
  info: string;
  newRaum: string;
  oldRaum: string;
  stunde: string;
  typ: string;
  nd?: 1;
}

export class VertretungsPlanSeite {
  infos: string[];
  vp: VertretungsDatum[];
}
