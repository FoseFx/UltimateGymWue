import { Component, OnInit } from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';
import {Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  constructor(private router: Router, private query: AppQuery) { }

  ngOnInit() {
  }

  onClick(user: InputComponent, passw: InputComponent) {


    // todo this.router.navigate(['/setup/basics/stufen']);
  }

}
