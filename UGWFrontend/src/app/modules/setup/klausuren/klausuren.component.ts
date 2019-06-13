import {Component} from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {AppQuery} from '../../../state/app.query';
import {Kurse} from '../../../../types/Kurs';

@Component({
  selector: 'app-klausuren',
  templateUrl: './klausuren.component.html',
  styleUrls: ['./klausuren.component.scss']
})
export class KlausurenComponent {

  constructor(private setupQuery: SetupQuery, private appQuery: AppQuery) { }

  active: boolean[] = [];
  kurse: Kurse =
      !!this.appQuery.getValue().basics
        ? this.appQuery.getValue().basics.kurse
        : this.setupQuery.getSelectedKurse();

  next() {
    // todo
  }

}
