//
// The App Store should only
// keep absolutely needed information
//

import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';

export interface AppState {
  meta: {
    version: string;
  };
  loginData: {
    token: string,
    uid: string,
    provider: ('normal'|'google'|'insta')[],
    normal: {
      email: string,
      email_verified: boolean
    },
    google: {
      email: string,
      gid: string
    }
  };
  fullname: string;
  basics: {
    stufe: string,
    stufe_id: string
    // todo
  };
  menuOpen: boolean;
}

export function createInitialState(): AppState {
  if (!!localStorage.app_state) {
    return JSON.parse(localStorage.app_state);
  }
  return {
    meta: {
      version: '0.0.1'
    },
    fullname: null,
    loginData: null,
    menuOpen: false,
    basics: null
  };
}

@StoreConfig({name: 'AppStore'})
@Injectable()
export class AppStore extends Store<AppState> {

  constructor() {
    super(createInitialState());
  }

}
