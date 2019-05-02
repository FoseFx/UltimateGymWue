import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';
import {Kurse} from '../../../../types/Kurs';
import {map} from 'rxjs/operators';
import {AvailableKurseMap} from '../state/setup.store';

@Component({
  selector: 'app-kurse',
  templateUrl: './kurse.component.html',
  styleUrls: ['./kurse.component.scss']
})
export class KurseComponent implements OnInit {

  constructor(private setupQuery: SetupQuery,
              private http: HttpClient,
              private appQuery: AppQuery,
              public setupService: SetupService) { }

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
      (error) => {
        console.error(error);
        this.error = error.message;
        try {
          if (!!error.error.msg) {
            this.error = error.error.msg;
          }
        } catch (e) {}
        this.loading = false;
      }
    );
  }

  onSetKurse() {
    if (!this.setupQuery.getHasSelectedAllKurse()) {
      return;
    }
    this.loading = true;
    const selectedKurse = this.setupQuery.getSelectedKurse();
    console.log(selectedKurse);
    // todo send to server and route
  }

}
