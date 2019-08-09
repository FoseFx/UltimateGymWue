import {Component} from '@angular/core';
import {SetupQuery} from '../../state/setup.query';
import {InputComponent} from '../../../ui/input/input.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {SetupService} from '../../state/setup.service';
import {LoginService} from '../../login/login.service';
import {Router} from '@angular/router';
import {handleError} from 'src/app/util';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent {

  constructor(public query: SetupQuery,
              public service: SetupService,
              public http: HttpClient,
              public loginService: LoginService,
              public router: Router) { }

  loading = false;
  error: string = null;

  onClick(email: InputComponent, passw: InputComponent, passwwdh: InputComponent) {
    if (this.invalid(email, passw, passwwdh)) {
      return;
    }
    this.loading = true;
    let sub = null;
    sub = this.http.post(environment.urls.registerNormal, {
      fullname: this.query.getValue().name,
      email: email.value,
      password: passw.value
    }).subscribe(
      (data: string) => this.onSuccess(data, sub, email, passw),
      (error) => handleError(this, error)
    );
  }

  onSuccess(data: string, sub: Subscription, email: InputComponent, passw: InputComponent) {
    sub.unsubscribe();
    console.log(data);
    this.loginService.normalLogin(email.value, passw.value).subscribe((_) => {
        this.service.justRegistered();
        this.router.navigate(['/setup/basics']);
      },
  (error) => handleError(this, error)
    );
  }

  invalid(email: InputComponent, passw: InputComponent, passwwdh: InputComponent) {
    return email.value === '' || passw.value === '' || email.invalid || passw.invalid || passw.value !== passwwdh.value;
  }
}
