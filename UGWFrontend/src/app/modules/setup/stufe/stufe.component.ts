import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stufe',
  templateUrl: './stufe.component.html',
  styleUrls: ['./stufe.component.scss']
})
export class StufeComponent implements OnInit {

  loading = false;
  error: string;

  constructor(public setupQuery: SetupQuery,
              private http: HttpClient,
              private appQuery: AppQuery,
              private setupService: SetupService,
              private router: Router) { }

  ngOnInit() {
    if (!this.appQuery.hasCredentials()) {return; }
    this.loading = true;
    const sub = this.http.get(
      environment.urls.getStufen,
      {headers: {Authorization: this.appQuery.loginToken, 'x-gw-auth': this.appQuery.credentialsToken}}
    )
      .subscribe(
        (next: {error: boolean, data: string[]}) => {
          sub.unsubscribe();
          console.log(next);
          this.setupService.setAvailStufen(next.data);
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
          sub.unsubscribe();
        }
      );
  }

  next(stufe: string) {
    console.log(stufe, !!stufe);
    if (!stufe) {
      return;
    }
    this.setupService.setStufe(stufe);
    this.router.navigate(['/setup/basics/kurse']).catch(err => console.error(err));
  }

}
