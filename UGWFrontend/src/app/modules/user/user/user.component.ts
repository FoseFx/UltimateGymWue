import { Component } from '@angular/core';
import {AppQuery} from '../../../state/app.query';
import {Observable} from 'rxjs';
import {LoginData} from '../../../state/app.store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private appQuery: AppQuery, private router: Router) { }

  showLogoutPopup = false;

  user$: Observable<LoginData> = this.appQuery.select('loginData');
  name$: Observable<string> = this.appQuery.select('fullname');

  logout() {
    localStorage.clear();
    this.router.navigate(['/setup/welcome']);
    location.reload();
  }
}
