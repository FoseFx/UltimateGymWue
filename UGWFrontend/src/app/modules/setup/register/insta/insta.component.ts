import {Component} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SetupQuery} from '../../state/setup.query';
import {Router} from '@angular/router';
import {AppService} from '../../../../state/app.service';
import {LoginResponse} from '../../login/login.service';
import {handleError} from 'src/app/util';
import {SetupService} from '../../state/setup.service';

@Component({
  selector: 'app-insta',
  templateUrl: './insta.component.html',
  styleUrls: ['./insta.component.scss']
})
export class InstaComponent implements InstaComponentInterface{

  constructor(public http: HttpClient,
              public query: SetupQuery,
              public service: AppService,
              public router: Router,
              public setupService: SetupService) { }

  loading = false;
  error: string;

  static createPopup(screen: Screen): Window {
    const left = (screen.width / 2) - (600 / 2);
    const top = (screen.height / 2) - (600 / 2);
    return window.open(
      environment.urls.registerInstaRediect,
      'popup',
      `top=${top},left=${left},width=${600},height=${600}`
    );
  }

  static preRequest(component: InstaComponentInterface, href: string): {code: string, firstPart: string} {
    const firstPart = href.split('?')[0];
    const queries = InstaComponent.extractQueries(href);

    if (!!queries.error) {
      component.error = decodeURIComponent(queries.error_description).replace(/\+/g, ' ');
      component.loading = false;
      return null;
    }

    if (!queries.code) {
      component.error = 'Instagram hat nicht wie erwartet geantwortet.';
      component.loading = false;
      return null;
    }
    const code = queries.code;
    return {code, firstPart};
  }

  static extractQueries(href: string): {code?: string, error?: string, error_description?: string, error_reason?: string}  {
    const queryStrings = href.split('/assets/insta-redirect.html?')[1].split('&');
    const querys = {};
    queryStrings.forEach((pair: string) => {
      const query = pair.split('=');
      querys[query[0]] = query[1];
    });
    return querys;
  }

  static startInterval(component: InstaComponentInterface, child: Window) {
    let interv = -1;
    interv = window.setInterval(() => {
      console.log('closed', child.closed);
      if (child.closed) {
        clearInterval(interv);
      }

      const href = child.location.href;
      console.log('href', href);

      if (/^.*\/assets\/insta-redirect.html.*$/.test(href)) {
        component.loading = true;
        child.close();
        clearInterval(interv);
        component.onData(href);
      }
    }, 500);
  }

  onClick() {
    this.error = undefined;

    const child = InstaComponent.createPopup(window.screen);

    if (child === null) {
      // popup blocked?
      return;
    }
    InstaComponent.startInterval(this, child);
  }

  onData(href: string) {
    const pr = InstaComponent.preRequest(this, href);
    if (pr === null) {
      return;
    }
    const {code, firstPart} = pr;
    this.http.post(environment.urls.registerInsta, {code, href: firstPart, fullname: this.query.getValue().name}).subscribe(
      (data: LoginResponse) => {
        console.log(data);
        this.setupService.justRegistered();
        this.service.onLogin(data);
        this.router.navigate(['/setup/basics']);

      },
      (error) => handleError(this, error)
    );

  }
}
export interface InstaComponentInterface {
  error: string;
  loading: boolean;
  onData(href: string);
}
