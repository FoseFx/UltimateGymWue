import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TimeTableDay} from '../../../../../types/TT';

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

  constructor() { }

  ngOnInit() {
  }

}
