//
// The App Store should only
// keep absolutely needed information
//

import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Kurse} from 'src/types/Kurs';
import {TimeTable} from '../../types/TT';
import * as packageJson from '../../../package.json';

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
  basics: AppStoreBasics;
  klausuren: string[];
  menuOpen: boolean;
  credentials: {
    token: string,
    has_lehrer: boolean
  };
  thisDay: Date;
  nextDay: Date;
}

export class AppStoreBasics {
  stufe: string;
  // tslint:disable-next-line:variable-name
  stufe_id: string;
  kurse: Kurse;
  stundenplan: TimeTable;
  stundenplanWithInfos: TimeTable;
  vertretungsplan: VertretungsPlanSeite[];
  vdFetchedAt: Date;
  hiddenNonKurse: string[];
}

export function getVersion(): string {
  return packageJson.version;
}

export function createInitialState(): AppState {
  const defaultValue = {
    meta: {
      version: getVersion()
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
  const appState = localStorage.getItem('app_state');
  if (!!appState) {
    const storage: AppState = JSON.parse(appState);
    Object.keys(storage).forEach((key: string) => {
      if (defaultValue.hasOwnProperty(key)) {
        defaultValue[key] = storage[key];
      }
    });
  }
  return defaultValue;
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
