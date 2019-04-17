import { Component, OnInit } from '@angular/core';
import {InputComponent} from '../../ui/input/input.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  allow(email: InputComponent, password: InputComponent) {
    return !(email.invalid || email.value === '' || password.invalid || password.value === '');
  }

  onSubmit(email: InputComponent, password: InputComponent) {
    if (!this.allow(email, password)) {
      return;
    }
    console.log('Ok');
  }

}
