import { Component } from '@angular/core';
import {AppQuery} from '../../../state/app.query';
import {Observable} from 'rxjs';
import {LoginData} from '../../../state/app.store';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private appQuery: AppQuery, private router: Router, private http: HttpClient) { }

  showLogoutPopup = false;
  logoutOrAccountRemoval = 0; // 0 = logout, 1 = account removal

  user$: Observable<LoginData> = this.appQuery.select('loginData');
  name$: Observable<string> = this.appQuery.select('fullname');

  logout() {
    localStorage.clear();
    this.router.navigate(['/setup/welcome']);
    location.reload();
  }

  showAccountLoeschen() {
    this.showLogoutPopup = true;
    this.logoutOrAccountRemoval = 1;
  }

  doShowLogout() {
    this.showLogoutPopup = true;
    this.logoutOrAccountRemoval = 0;
  }

  removeAcc() {
    this.http.delete(environment.urls.removeAccount, {headers: {
      authorization: this.appQuery.loginToken
    }}).subscribe((res) => {
      console.log(res);
      this.logout();      
    }, 
    (err) => {
      console.error(err);
    });
  }
}
