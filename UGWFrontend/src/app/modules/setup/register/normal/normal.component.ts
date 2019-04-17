import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../../state/setup.query';
import {InputComponent} from '../../../ui/input/input.component';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {SetupService} from '../../state/setup.service';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent implements OnInit {

  constructor(public query: SetupQuery, private service: SetupService, private http: HttpClient) { }

  loading = false;
  error: string = null;
  ngOnInit() {
  }

  register() {
  }

  onClick(email: InputComponent, passw: InputComponent, passwwdh: InputComponent) {
    if (email.value === '' || passw.value === '' || email.invalid || passw.invalid || passw.value !== passwwdh.value){
      return;
    }
    this.loading = true;

    this.http.post(environment.urls.registerNormal, {
      fullname: this.query.getValue().name,
      email: email.value,
      password: passw.value
    }).pipe(

    ).subscribe((data: string) => {
        console.log(data);
        // todo login and route
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.error = err.error.msg;
        if (typeof this.error === 'undefined') {
          this.error = err.statusText;
        }
        this.loading = false;
      }
    );
  }
}
