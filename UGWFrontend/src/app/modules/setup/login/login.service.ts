import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AppService} from '../../../state/app.service';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private appService: AppService) {}

  normalLogin(email: string, password: string): Observable <LoginResponse> {
    return (this.http.post(environment.urls.loginNormal, {
      email,
      password
    }) as Observable<LoginResponse>).pipe(
      map(res => {
        if (res.error) {
          throw new Error(res.msg);
        }
        return res;
      }),
      tap((res) => {
        console.log('tap', res);
        this.appService.onLogin(res);
      })
    );
  }

  googleLogin(token: string): Observable<LoginResponse> {
    return (
      this.http.post(environment.urls.loginGoogle, {token}
    ) as Observable<LoginResponse>).pipe(
      map(res => {
        if (res.error) {
          throw new Error(res.msg);
        }
        return res;
      }),
      tap((res) => {
        console.log('tap', res);
        this.appService.onLogin(res);
      })
    );
  }


  instaLogin(code: string, href: string): Observable<LoginResponse> {
    return (
      this.http.post(environment.urls.loginInsta, {code, href}
    ) as Observable<LoginResponse>).pipe(
      map(res => {
        if (res.error) {
          throw new Error(res.msg);
        }
        return res;
      }),
      tap((res) => {
        console.log('tap', res);
        this.appService.onLogin(res);
      })
    );
  }



}

export class LoginResponse {
  error: boolean;
  msg?: string;
  data?: {
    token: string,
    claim: {
      fullname: string,
      uid: string,
      provider: ('normal'|'google'|'insta')[],
      normal?: {
        email: string,
        email_verified: boolean
      }
      google?: {
        gid: string,
        email: string
      }
      insta?: {
        iid: string,
        token: string
      }
    }
  };
}
