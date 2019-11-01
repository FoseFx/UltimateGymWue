import {Component, OnInit} from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';
import {AppService} from '../../../state/app.service';
import {SetupQuery} from '../state/setup.query';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  loading = false;
  error: string;

  constructor(
    public router: Router,
    public query: AppQuery,
    public service: AppService,
    public setupQuery: SetupQuery) { }

  ngOnInit() {
    if (this.query.getValue().loginData === null) {return; } // this line is only for the tests
    return;
  }

  onClick(user: InputComponent, passw: InputComponent) {
    this.service.addCreds('DEMO_CRED_TOKEN');
    this.router.navigate(['/setup/basics/stufe']);
  }

}
