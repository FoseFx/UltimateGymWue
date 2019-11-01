import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AppService} from '../../../state/app.service';

@Injectable()
export class LoginService {
  constructor(public appService: AppService) {}

  normalLogin(_: string, __: string): Observable <LoginResponse> {
      this.appService.onLogin({error: false});
      return of({error: false});
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
