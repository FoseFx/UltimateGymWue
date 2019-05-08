import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';
import {Kurse} from '../../../../types/Kurs';
import {map} from 'rxjs/operators';
import {AvailableKurseMap} from '../state/setup.store';
import { StundenplanService } from '../services/stundenplan.service';
import { handleError } from 'src/app/util';

@Component({
  selector: 'app-kurse',
  templateUrl: './kurse.component.html',
  styleUrls: ['./kurse.component.scss']
})
export class KurseComponent implements OnInit {

  constructor(private setupQuery: SetupQuery,
              private http: HttpClient,
              private appQuery: AppQuery,
              public setupService: SetupService,
              private stundenplanService: StundenplanService) { }

  loading = false;
  error: string;

  kurseTitle$ = this.setupQuery.availKurse$.pipe(map((amap: AvailableKurseMap) => Object.keys(amap)));

  ngOnInit() {
    if (this.setupQuery.getStufe() === null) { return; } // for the tests, should be captured by router guard
    this.loading = true;
    this.http.get(
      `${environment.urls.getKurse}/${this.setupQuery.getStufe()}`,
      {headers: {Authorization: this.appQuery.loginToken, 'x-gw-auth': this.appQuery.credentialsToken}}
    ).subscribe(
      (next: {error: boolean, msg?: string, data?: Kurse}) => {
        console.log(next);
        if (!next.error) {
          this.setupService.setAvailableKurse(next.data);
        }
        this.loading = false;
      },
      (error) => handleError(this, error)
    );
  }

  onSetKurse() {
    if (!this.setupQuery.getHasSelectedAllKurse() || this.loading) {
      return;
    }
    this.loading = true;
    const selectedKurse = this.setupQuery.getSelectedKurse();
    this.http.put(
      environment.urls.setBasics,
      {kurse: selectedKurse, stufe: this.setupQuery.getStufe()},
      {headers: {Authorization: this.appQuery.loginToken}}
    ).subscribe(
      (next: {error: boolean, msg: string}) => {
        console.log(next);
        this.stundenplanService.getSp().subscribe(_ => {
          // todo route to landing
        }, error => handleError(this, error));
      },
      (error) => handleError(this, error)
    );

  }

}
