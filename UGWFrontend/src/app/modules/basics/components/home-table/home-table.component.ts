import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TimeTableDay, TimeTableField} from '../../../../../types/TT';
import {VertretungsPlanSeite} from '../../../../state/app.store';
import {BasicsService} from '../../state/basics.service';

@Component({
  selector: 'app-home-table',
  templateUrl: './home-table.component.html',
  styleUrls: ['./home-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTableComponent {

  @Input() today: TimeTableDay;
  @Input() date: Date;
  @Input() abWoche: 0|1;
  @Input() stufe: string;
  @Input() showSpinner = false;
  @Input() fetchedAt = null;
  @Input() online = true;
  Svd: VertretungsPlanSeite = null;
  noVDFound = false;

  @Input() set vd(value: VertretungsPlanSeite[]) {
    console.log(value);
    for (const v of value) {
      if (!!v) { // ignore null
        if (v.infos[0] === `${this.date.getDate()}.${this.date.getMonth() + 1}.${this.date.getFullYear()}`) {
          this.Svd = v;
          return;
        }
      }
    }
    if (value[0] !== null && value[1] !== null) {
      this.noVDFound = true;
    }
  }

  constructor(public basicsService: BasicsService) { }

  onTrClick(stunde: TimeTableField) {
    this.basicsService.newPopup({stunde});
  }

  get showVD() {
    if (!this.Svd) {
      return false;
    }
    return (!!this.Svd.vp || this.Svd.infos.length > 1);
  }
}
