import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {addGoogleScript} from '../../utils';
import {GoogleUser} from '../../register/google/google.component';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';
import {handleError} from 'src/app/util';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent implements OnInit {

  error: string;
  loading = false;

  constructor(public router: Router,
              public loginService: LoginService,
              private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    addGoogleScript();
  }

  onOk(googleUser: GoogleUser) {
    this.loading = true;
    this.cdref.detectChanges();
    const token = googleUser.getAuthResponse().id_token;

    console.log('token', token);
    this.loginService.googleLogin(token).subscribe(
      (_) => {
        this.router.navigate(['/setup/basics/stufe']);
      },
      (error) => {
        handleError(this, error);
        this.cdref.detectChanges();
      }
    );

  }
}
