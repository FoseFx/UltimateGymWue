import {Injectable} from '@angular/core';
import {BasicsStore} from './basics.store';
import {TimeTableField} from '../../../../types/TT';

@Injectable()
export class BasicsService {

  constructor(private store: BasicsStore) { }

  newPopup(pl: {stunde: TimeTableField}) {
    this.store.update({
      showPopup: true,
      popupData: pl
    });
  }
  closePopup() {
    this.store.update({
      showPopup: false,
      popupData: null
    });
  }
}
