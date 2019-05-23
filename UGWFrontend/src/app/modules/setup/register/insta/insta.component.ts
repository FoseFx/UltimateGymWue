import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SetupQuery} from '../../state/setup.query';
import {Router} from '@angular/router';
import {AppService} from '../../../../state/app.service';
import {LoginResponse} from '../../login/login.service';
import { handleError } from 'src/app/util';
import {SetupService} from '../../state/setup.service';

@Component({
  selector: 'app-insta',
  templateUrl: './insta.component.html',
  styleUrls: ['./insta.component.scss']
})
export class InstaComponent implements OnInit {

  loading = false;
  error: string;

  constructor(private http: HttpClient,
              private query: SetupQuery,
              private service: AppService,
              private router: Router,
              private setupService: SetupService) { }

  ngOnInit() {
  }

  onClick() {
    this.error = undefined;
    const left = (screen.width / 2) - (600 / 2);
    const top = (screen.height / 2) - (600 / 2);
    const child = window.open(environment.urls.registerInstaRediect, 'popup', `top=${top},left=${left},width=${600},height=${600}`);

    if (child === null) {
      return;
    }
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

  onData(href: string) {
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

    const code = querys.code;
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
