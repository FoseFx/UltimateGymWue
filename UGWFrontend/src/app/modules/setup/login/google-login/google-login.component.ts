import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {addGoogleScript} from '../../utils';
import {GoogleUser} from '../../register/google/google.component';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent implements OnInit {

  error: string;
  loading = false;

  constructor(private router: Router, private loginService: LoginService, private cdref: ChangeDetectorRef) { }

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
        console.log(error);
        if (!!error.error.msg) {
          this.error = error.error.msg;
        } else {
          this.error = error.message;
        }
        console.log(error);
        this.loading = false;
        this.cdref.detectChanges();
      }
    );

  }
}
