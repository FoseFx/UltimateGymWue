import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {TimeTableField} from '../../../../types/TT';

export class PopupData {
  stunde: TimeTableField;
}

export class BasicsState {
  showPopup: boolean;
  popupData: PopupData;
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
