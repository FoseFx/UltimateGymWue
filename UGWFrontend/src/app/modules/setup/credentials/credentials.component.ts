import { Component, OnInit } from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  loading = false;
  error: string;

  constructor(private router: Router, private query: AppQuery, private http: HttpClient) { }

  ngOnInit() {
  }

  onClick(user: InputComponent, passw: InputComponent) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.http.post(environment.urls.addCredentials, {user: user.value, passw: passw.value}).subscribe(
      (next) => {
        console.log(next);
        this.router.navigate(['/setup/basics/stufen']);
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
