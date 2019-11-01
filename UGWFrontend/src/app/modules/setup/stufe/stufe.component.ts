import {Component, OnInit} from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';
import {Router} from '@angular/router';
import {StundenplanService} from '../services/stundenplan.service';
import {of} from "rxjs";

@Component({
  selector: 'app-stufe',
  templateUrl: './stufe.component.html',
  styleUrls: ['./stufe.component.scss']
})
export class StufeComponent implements OnInit {

  loading = false;
  error: string;

  constructor(public setupQuery: SetupQuery,
              public appQuery: AppQuery,
              public setupService: SetupService,
              public router: Router,
              public stundenplanService: StundenplanService) { }

  async ngOnInit() {
    if (!this.appQuery.hasCredentials()) {return; }
    this.loading = true;
    const data = ['Demo'];
    this.setupService.setAvailStufen(data);
    this.loading = false;
  }

  next(stufe: string) {
    if (!stufe) {
      return;
    }
    this.setupService.setStufe(stufe);
    this.router.navigate(['/setup/basics/kurse']).catch(err => console.error(err));
  }

  fetchBasics(): Promise<boolean> {
    return this.stundenplanService.getSp().toPromise()
      .then(_ => {
        this.router.navigate(['/setup/basics/klausuren']);
        return true;
      }).catch(err => {
        console.error(err);
        return false;
    });
  }

}
