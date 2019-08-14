import {Injectable} from '@angular/core';
import {AppService} from 'src/app/state/app.service';
import {SetupQuery} from '../state/setup.query';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Kurse} from 'src/types/Kurs';
import {AppQuery} from 'src/app/state/app.query';
import {DataResponse} from 'src/types/Responses';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TimeTable} from '../../../../types/TT';

@Injectable()
export class StundenplanService {
  constructor(public appService: AppService,
              public setupQuery: SetupQuery,
              public appQuery: AppQuery,
              public http: HttpClient) {}

  getSp(): Observable<DataResponse<any>> {
    return this.http.get(environment.urls.getStundenplan, {
        headers: {
          Authorization: this.appQuery.loginToken,
          'x-gw-auth': this.appQuery.credentialsToken
        }
      }).pipe(
        tap((next: DataResponse<{kurse: Kurse, sp: TimeTable, stufe: string}>) => {
          const {kurse, sp, stufe} = next.data;
          console.log(next);
          this.appService.setKurseStufeStundenplan(kurse, stufe, sp);
      })
    );
  }
}
