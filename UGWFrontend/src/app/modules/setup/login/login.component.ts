import {Component, OnDestroy, OnInit} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {LoginService} from './login.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  errorMsg: string = null;
  loading = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  allow(email: InputComponent, password: InputComponent) {
    return !(email.invalid || email.value === '' || password.invalid || password.value === '');
  }

  onSubmit(email: InputComponent, password: InputComponent) {
    if (!this.allow(email, password)) {
      return;
    }
    this.loading = true;

    this.subs.push(
      this.loginService.normalLogin(email.value, password.value)
        .subscribe(
          (_) => {
            this.router.navigate(['/setup/basics']);
          },
          (error) => {
            console.log(!!error.error);
            console.error('error', error);
            if (!!error.error) { // http error
              this.errorMsg = error.error.msg;
            } else {
              this.errorMsg = error.message;
            }
            this.loading = false;
          })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(value => {
      value.unsubscribe();
    });
  }

  route(path: string[]) {
    this.router.navigate(path);
  }
}
