import {Component, OnInit} from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';
import {Kurse} from '../../../../types/Kurs';
import {map} from 'rxjs/operators';
import {AvailableKurseMap} from '../state/setup.store';
import {StundenplanService} from '../services/stundenplan.service';
import {handleError} from 'src/app/util';
import {Router} from '@angular/router';

@Component({
  selector: 'app-kurse',
  templateUrl: './kurse.component.html',
  styleUrls: ['./kurse.component.scss']
})
export class KurseComponent implements OnInit {

  constructor(public setupQuery: SetupQuery,
              public appQuery: AppQuery,
              public setupService: SetupService,
              public stundenplanService: StundenplanService,
              public router: Router) { }

  loading = false;
  error: string;

  kurseTitle$ = this.setupQuery.availKurse$.pipe(map((amap: AvailableKurseMap) => Object.keys(amap)));

  ngOnInit() {
    if (this.setupQuery.getStufe() === null) { return; } // for the tests, should be captured by router guard
    this.loading = true;
    const data: Kurse = [];
    this.setupService.setAvailableKurse(data);
    this.loading = false;
  }

  onSetKurse() {
    if (!this.setupQuery.getHasSelectedAllKurse() || this.loading) {
      return;
    }
    this.loading = true;
    const selectedKurse = this.setupQuery.getSelectedKurse();
    this.stundenplanService.getSp().subscribe(_ => {
      this.router.navigate(['/setup/basics/klausuren']);
    }, error => handleError(this, error));
  }

}
