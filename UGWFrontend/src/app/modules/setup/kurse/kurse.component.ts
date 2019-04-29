import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';

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

  ngOnInit() {
    if (this.setupQuery.getStufe() === null) { return; } // for the tests, should be captured by router guard
    this.loading = true;
    this.http.get(
      `${environment.urls.getKurse}/${this.setupQuery.getStufe()}`,
      {headers: {Authorization: this.appQuery.loginToken, 'x-gw-auth': this.appQuery.credentialsToken}}
    ).subscribe(
      (next) => {
        console.log(next);
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

}
