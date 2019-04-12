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
}

export function createInitialState(): AppState {
  return {
    meta: {
      version: '0.0.1'
    }
  };
}

@StoreConfig({name: 'AppStore'})
@Injectable()
export class AppStore extends Store<AppState> {

  constructor() {
    super(createInitialState());
  }

}
