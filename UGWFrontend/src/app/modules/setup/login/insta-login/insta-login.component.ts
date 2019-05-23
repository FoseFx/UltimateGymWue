import { Component } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-insta-login',
  templateUrl: './insta-login.component.html',
  styleUrls: ['./insta-login.component.scss']
})
export class InstaLoginComponent {

  error: string;
  loading = false;
  constructor(private loginService: LoginService, private router: Router) { }


  onClick() {
    this.error = undefined;
    const left = (screen.width / 2) - (600 / 2);
    const top = (screen.height / 2) - (600 / 2);
    const child = window.open(environment.urls.registerInstaRediect, 'popup', `top=${top},left=${left},width=${600},height=${600}`);

    const interv = setInterval(() => {
      console.log('closed', child.closed);
      if (child.closed) {
        clearInterval(interv);
      }

      const href = child.location.href;
      console.log('href', href);

      if (/^.*\/assets\/insta-redirect.html.*$/.test(href)) {
        this.loading = true;
        child.close();
        clearInterval(interv);
        this.onData(href);
      }
    }, 500);

  }

  onData(href) {
    const firstPart = href.split('?')[0];
    const queryStrings = href.split('/assets/insta-redirect.html?')[1].split('&');
    const querys: {code?: string, error?: string, error_description?: string, error_reason?: string} = {};

    queryStrings.forEach((pair: string) => {
      const query = pair.split('=');
      querys[query[0]] = query[1];
    });
    console.log(querys);


    if (!!querys.error) {
      this.error = decodeURIComponent(querys.error_description).replace(/\+/g, ' ');
      this.loading = false;
      return;
    }

    if (!querys.code) {
      this.error = 'Instagram hat nicht wie erwartet geantwortet.';
      this.loading = false;
      return;
    }

    this.loginService.instaLogin(querys.code, firstPart).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(['/setup/basics']);
      },
      (error) => {
        console.log(error);
        if (!!error.error.msg) {
          this.error = error.error.msg;
        } else {
          this.error = error.message;
        }
        this.loading = false;
      }
    );

  }

}
