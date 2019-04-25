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
  }

  onClick(user: InputComponent, passw: InputComponent) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.http.post(
      environment.urls.addCredentials,
      {username: user.value, password: passw.value, lehrer: false},
      {headers: {Authorization: 'Bearer ' + this.query.getValue().loginData.token}}
      ).subscribe(
      (next: {msg: string, error: boolean}) => {
        console.log(next);
        this.service.addCreds(next.msg);
        this.router.navigate(['/setup/basics/stufe']);
      },
      (error) => {
        console.error(error);
        if (!!error.error.msg) {
          this.error = error.error.msg;
        } else {
          this.error = error.message;
        }
        this.loading = false;
      }
    );

  }

}
