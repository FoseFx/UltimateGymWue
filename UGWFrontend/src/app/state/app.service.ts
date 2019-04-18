import {Injectable} from '@angular/core';
import {AppStore} from './app.store';
import {AppQuery} from './app.query';
import {LoginResponse} from '../modules/setup/login/login.service';

@Injectable()
export class AppService {
  constructor(private store: AppStore, private query: AppQuery) {
  }
  changeMenuState() {
    this.store.update({menuOpen: !this.query.getValue().menuOpen});
  }
  onLogin(loginData: LoginResponse) {

    const provider = loginData.data.claim.provider;

    if (provider.find((val) => val === 'normal') !== null) {
      this.store.update({
        loginData: {
          uid: loginData.data.claim.uid,
          provider,
          normal: {
            email: loginData.data.claim.normal.email,
            email_verified: loginData.data.claim.normal.email_verified,
          }
        }
      });
    }


    this.store.update({
      fullname: loginData.data.claim.fullname
    });

    this.save();
  }


  private save() {
    localStorage.app_state = JSON.stringify(this.query.getValue());
  }
}
