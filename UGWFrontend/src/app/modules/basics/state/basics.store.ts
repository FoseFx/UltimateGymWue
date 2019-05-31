import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {TimeTableField} from "../../../../types/TT";

export class BasicsState {
  showPopup: boolean;
  popupData: {
    stunde: TimeTableField
  };
}

function createDefaultState(): BasicsState {
  return {
    showPopup: false,
    popupData: null
  };
}

@StoreConfig({name: 'BasicsStore'})
@Injectable()
export class BasicsStore extends Store<BasicsState> {
  constructor() {
    super(createDefaultState());
  }
}
