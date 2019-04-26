import { Component, OnInit } from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppService} from '../../../state/app.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  loading = false;
  error: string;

  constructor(private router: Router, private query: AppQuery, private http: HttpClient, private service: AppService) { }

  ngOnInit() {
    if (this.query.getValue().loginData === null) {return;} // this line is only for the tests
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
      (error) => {
        console.error(error);
        // ignore errors caused by automatic network requests
        this.loading = false;
        sub.unsubscribe();
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
      (error) => {
        console.error(error);
        if (!!error.error.msg) {
          this.error = error.error.msg;
        } else {
          this.error = error.message;
        }
        this.loading = false;
        sub.unsubscribe();
      }
    );

  }

}
