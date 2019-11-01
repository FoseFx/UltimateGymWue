import {Component, OnDestroy} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {LoginService} from './login.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {handleError} from 'src/app/util';
import {TrackingService} from '../../../services/tracking.service';
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  subs: Subscription[] = [];
  error: string = null;
  loading = false;
  allowTracking = true;

  constructor(public loginService: LoginService, public router: Router, public trackingService: TrackingService, public snack: SnackbarService) { }


  allow(email: InputComponent, password: InputComponent) {
    return !(email.invalid || email.value === '' || password.invalid || password.value === '');
  }

  onSubmit(email: InputComponent, password: InputComponent) {
    if (!this.allow(email, password)) {
      return;
    }
    this.loading = true;
    if (this.allowTracking) {
      this.trackingService.giveConsent();
    } else {
      this.trackingService.revokeConsent();
    }

    this.subs.push(
      this.loginService.normalLogin(email.value, password.value)
        .subscribe(
          (_) => {
            this.router.navigate(['/setup/basics']);
          },
          (error) => handleError(this, error)
        )
    );
  }

  ngOnDestroy() {
    this.subs.forEach(value => {
      try {
        value.unsubscribe();
      } catch (e) {

      }
    });
  }

  route(path: string[]) {
    this.router.navigate(path);
  }
}
