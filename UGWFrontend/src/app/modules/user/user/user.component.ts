import { Component } from '@angular/core';
import {AppQuery} from '../../../state/app.query';
import {Observable} from 'rxjs';
import {LoginData} from '../../../state/app.store';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private appQuery: AppQuery) { }

  user$: Observable<LoginData> = this.appQuery.select('loginData');
}
