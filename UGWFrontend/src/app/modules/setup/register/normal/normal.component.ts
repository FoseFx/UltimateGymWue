import { Component } from '@angular/core';
import {SetupQuery} from '../../state/setup.query';
import {InputComponent} from '../../../ui/input/input.component';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {SetupService} from '../../state/setup.service';
import {LoginService} from '../../login/login.service';
import {Router} from '@angular/router';
import { handleError } from 'src/app/util';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent {

  constructor(public query: SetupQuery,
              private service: SetupService,
              private http: HttpClient,
              private loginService: LoginService,
              private router: Router) { }

  loading = false;
  error: string = null;

  register() {
  }

  onClick(email: InputComponent, passw: InputComponent, passwwdh: InputComponent) {
    if (email.value === '' || passw.value === '' || email.invalid || passw.invalid || passw.value !== passwwdh.value) {
      return;
    }
    this.loading = true;

    const sub = this.http.post(environment.urls.registerNormal, {
      fullname: this.query.getValue().name,
      email: email.value,
      password: passw.value
    }).pipe(

    ).subscribe((data: string) => {
        sub.unsubscribe();
        console.log(data);
        this.loginService.normalLogin(email.value, passw.value).subscribe(
          (res) => {

            this.router.navigate(['/setup/basics']);

          },
          (error) => handleError(this, error)
        );
      },
      (error) => handleError(this, error)
    );
  }
}
