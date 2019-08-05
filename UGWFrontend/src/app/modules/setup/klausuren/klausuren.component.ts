import {Component, OnInit} from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {AppQuery} from '../../../state/app.query';
import {Kurse} from '../../../../types/Kurs';
import {AppService} from '../../../state/app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-klausuren',
  templateUrl: './klausuren.component.html',
  styleUrls: ['./klausuren.component.scss']
})
export class KlausurenComponent implements OnInit {

  constructor(private setupQuery: SetupQuery,
              public appQuery: AppQuery,
              public appService: AppService,
              public router: Router) { }

  active: boolean[] = [];
  kurse: Kurse = this.initialKurse();

  save() {
    const klausuren = [];
    this.kurse.forEach(
      (k, i) => !!this.active[i] ? klausuren.push(k.fach) : null
    );
    this.appService.setKlausuren(klausuren);
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    const k = this.appQuery.getValue().klausuren;
    if (k.length !== 0) {
      this.kurse.forEach((kurs, i) => {
        if (k.find(v => kurs.fach === v)) {
          this.active[i] = true;
        }
      });
    }
  }

  initialKurse(): Kurse {
    return (!!this.appQuery.getValue().basics
        ? this.appQuery.getValue().basics.kurse
        : this.setupQuery.getSelectedKurse()
    ).filter(k => k.fach !== 'Frei');
  }


}
