import {Component} from '@angular/core';
import {BasicsService} from '../../state/basics.service';
import {BasicsQuery} from '../../state/basics.query';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PopupData} from '../../state/basics.store';
import {TimeTableField} from '../../../../../types/TT';
import {AppService} from '../../../../state/app.service';

@Component({
  selector: 'app-basics-popup',
  templateUrl: './basics-popup.component.html',
  styleUrls: ['./basics-popup.component.scss']
})
export class BasicsPopupComponent {

  constructor(private basicsService: BasicsService, public basicsQuery: BasicsQuery, private appService: AppService) { }

  popupData$: Observable<PopupData> = this.basicsQuery.popupData$;

  private stunde: TimeTableField;

  stunde$: Observable<TimeTableField> = this.popupData$.pipe(
    map(d => d === null ? null : d.stunde),
    tap((v) => this.stunde = v)
  );

  closePopup(): void {
    this.basicsService.closePopup();
  }

  hideNonKurse(): void {
    console.log(this.stunde.name);
    this.appService.hideNonKurs(this.stunde.name);
    this.closePopup();
  }

}
