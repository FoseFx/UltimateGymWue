import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../../state/setup.query';
import {InputComponent} from '../../../ui/input/input.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent implements OnInit {

  constructor(public query: SetupQuery, private http: HttpClient) { }

  loading = false;
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
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
