import {Component} from '@angular/core';
import {SetupQuery} from '../../state/setup.query';
import {InputComponent} from '../../../ui/input/input.component';
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
              public loginService: LoginService,
              public router: Router) { }

  loading = false;
  error: string = null;

  onClick(email: InputComponent, passw: InputComponent, passwwdh: InputComponent) {
    if (this.invalid(email, passw, passwwdh)) {
      return;
    }
    const data = '';
    this.onSuccess(data, null, email, passw);
  }

  onSuccess(_: string, __: null, email: InputComponent, passw: InputComponent) {
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
