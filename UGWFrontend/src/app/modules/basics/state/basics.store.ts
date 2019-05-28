import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';

export class BasicsState {
  showPopup: boolean;
}

function createDefaultState(): BasicsState {
  return {
    showPopup: false
  };
}

@StoreConfig({name: 'BasicsStore'})
@Injectable()
export class BasicsStore extends Store<BasicsState> {
  constructor() {
    super(createDefaultState());
  }
}
