import { Component, OnInit } from '@angular/core';
import {BasicsService} from '../../state/basics.service';
import {BasicsQuery} from '../../state/basics.query';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PopupData} from '../../state/basics.store';
import {TimeTableField} from '../../../../../types/TT';

@Component({
  selector: 'app-basics-popup',
  templateUrl: './basics-popup.component.html',
  styleUrls: ['./basics-popup.component.scss']
})
export class BasicsPopupComponent {

  constructor(private basicsService: BasicsService, private basicsQuery: BasicsQuery) { }

  popupData$: Observable<PopupData> = this.basicsQuery.popupData$;

  stunde$: Observable<TimeTableField> = this.popupData$.pipe(map(d => d === null ? null : d.stunde));

  closePopup(): void {
    this.basicsService.closePopup();
  }

}
