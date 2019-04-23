import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {SetupQuery} from '../../state/setup.query';
import {addGoogleScript} from '../../utils';
import {LoginService} from "../../login/login.service";
import {Router} from "@angular/router";

declare const gapi: any;

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GoogleComponent implements OnInit {
  public auth2: any;

  error: string;
  loading = false;

  constructor(private http: HttpClient,
              private query: SetupQuery,
              private changedetectionRef: ChangeDetectorRef,
              private loginService: LoginService,
              private router: Router) { }


  ngOnInit() {
    addGoogleScript();
  }

  onOk(googleUser: GoogleUser) {
    this.error = undefined;
    this.loading = true;
    this.changedetectionRef.detectChanges();

    const payload = {
      fullname: this.query.getValue().name,
      token: googleUser.getAuthResponse().id_token
    };
    console.log(payload);
    this.http.post(environment.urls.registerGoogle, payload).subscribe(
      (data: any) => {
        console.log(data);
        this.loginService.googleLogin(payload.token).subscribe(
          (loginData) => {
            this.router.navigate(['/setup/basics']);
            console.log(loginData);
          }, // next
          (error) => {
            if (!!error.error.msg) {
              this.error = error.error.msg;
            } else {
              this.error = error.message;
            }
            this.error = 'Nach erfolgreicher Registrierung: ' + this.error;
            this.changedetectionRef.detectChanges();
          } // error
        ); // googleLogin()

        this.changedetectionRef.detectChanges();
      }, // next
      (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error);
        if (!!error.error.msg) {
          this.error = error.error.msg;
        } else {
          this.error = error.message;
        }
        this.changedetectionRef.detectChanges();
      } // error
    ); // post
  }

}



@Component({
  selector: 'app-google-signin',
  template: '<div id="googleBtn">Bitte Warten...</div><div *ngIf="times > 10">Das dauert ungewöhnlich lange... Hast du einen Skriptblocker installiert?</div>'
})
export class GoogleSigninComponent implements AfterViewInit {

  @Output() ok = new EventEmitter();

  times = 0;

  private clientId = '945920838122-ms73bj0tvdfcjijt1dqis687f98m167v.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email'
  ].join(' ');

  public auth2: any;
  public googleInit() {
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    gapi.load('auth2', function() {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope
      });
      that.attachSignin(that.element.nativeElement.firstChild);
    });
  }
  public attachSignin(element) {
    const that = this;
    this.auth2.attachClickHandler(element, {},
      // tslint:disable-next-line:only-arrow-functions
      function(googleUser: GoogleUser){
        that.onSuccess(googleUser, that);
      },
      (error) => {
        console.log(JSON.stringify(error, undefined, 2));
    });
    gapi.signin2.render(element, {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onfailure: (err) => {alert(err); }
    });
  }

  constructor(private element: ElementRef) {
    console.log('ElementRef: ', this.element);
  }

  ngAfterViewInit() {
    this.checkAndInit();

  }

  checkAndInit() {
    setTimeout(() => {
      this.times++;
      if (typeof gapi === 'undefined') {
        this.checkAndInit();
      } else {
        this.googleInit();
      }
    }, 500);
  }

  onSuccess(googleUser: GoogleUser, that?: GoogleSigninComponent) {
    if (that) {
      that.ok.emit(googleUser);
    }
  }

}

export class GoogleUser {
  getBasicProfile: () => GoogleProfile;
  getAuthResponse: () => {id_token: string};

}

class GoogleProfile {
  getId: () => string;
  getName: () => string;
  getImageUrl: () => string;
  getEmail: () => string;
}