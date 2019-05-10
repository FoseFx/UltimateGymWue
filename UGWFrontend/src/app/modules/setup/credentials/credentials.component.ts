import { Component, OnInit } from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppService} from '../../../state/app.service';
import { handleError } from 'src/app/util';
import {SetupService} from '../state/setup.service';
import {SetupQuery} from '../state/setup.query';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  loading = false;
  error: string;

  constructor(
    private router: Router,
    private query: AppQuery,
    private http: HttpClient,
    private service: AppService,
    private setupQuery: SetupQuery) { }

  ngOnInit() {
    if (this.query.getValue().loginData === null) {return; } // this line is only for the tests
    if (this.setupQuery.getValue().justRegistered) {
      return; // no possibility user has credentials saved already
    }
    this.loading = true;
    const sub = this.http.get(
      environment.urls.fetchCredentials,
      {headers: {Authorization: this.query.loginToken}}
    ).subscribe(
      (next: {error: boolean, msg: string}) => {
        console.log(next);
        this.service.addCreds(next.msg);
        this.router.navigate(['/setup/basics/stufe']);
        sub.unsubscribe();
      },
      (error: HttpErrorResponse) => {
        if (error.status !== 400) {
          handleError(this, error); // only handle error, when not a user-not-found error
        } else {
          this.loading = false;
        }
      }
    );
  }

  onClick(user: InputComponent, passw: InputComponent) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const sub = this.http.post(
      environment.urls.addCredentials,
      {username: user.value, password: passw.value, lehrer: false},
      {headers: {Authorization: this.query.loginToken}}
      ).subscribe(
      (next: {msg: string, error: boolean}) => {
        console.log(next);
        this.service.addCreds(next.msg);
        this.router.navigate(['/setup/basics/stufe']);
        sub.unsubscribe();
      },
      (error) => handleError(this, error)
    );

  }

}
