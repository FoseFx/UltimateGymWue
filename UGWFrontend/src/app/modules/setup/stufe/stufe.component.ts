import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';
import {SetupService} from '../state/setup.service';

@Component({
  selector: 'app-stufe',
  templateUrl: './stufe.component.html',
  styleUrls: ['./stufe.component.scss']
})
export class StufeComponent implements OnInit {

  loading = false;
  error: string;

  constructor(public readonly setupQuery: SetupQuery,
              private http: HttpClient,
              private appQuery: AppQuery, private setupService: SetupService) { }

  ngOnInit() {
    if (!this.appQuery.hasCredentials()) {return;}
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

}
