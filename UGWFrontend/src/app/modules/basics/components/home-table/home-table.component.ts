import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TimeTableDay} from '../../../../../types/TT';
import {VertretungsPlanSeite} from '../../../../state/app.store';
import {BasicsService} from '../../state/basics.service';

@Component({
  selector: 'app-home-table',
  templateUrl: './home-table.component.html',
  styleUrls: ['./home-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTableComponent implements OnInit {

  @Input() today: TimeTableDay;
  @Input() date: Date;
  @Input() abWoche: 0|1;
  @Input() showSpinner = false;
  Svd: VertretungsPlanSeite = null;
  noVDFound = false;

  @Input() set vd(value: VertretungsPlanSeite[]) {
    console.log(value);
    for (const v of value) {
      if (!!v) {
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

  constructor(private basicsService: BasicsService) { }

  ngOnInit() {
  }

  onTrClick() {
    this.basicsService.showPopup = true;
  }

}
