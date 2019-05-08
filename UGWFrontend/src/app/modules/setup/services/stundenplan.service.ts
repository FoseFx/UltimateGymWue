import { Injectable } from '@angular/core';
import { AppService } from 'src/app/state/app.service';
import { SetupQuery } from '../state/setup.query';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Kurse } from 'src/types/Kurs';
import { AppQuery } from 'src/app/state/app.query';
import { DataResponse } from 'src/types/Responses';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class StundenplanService {
    constructor(private appService: AppService, private setupQuery: SetupQuery, private appQuery: AppQuery, private http: HttpClient) {}

    getSp(): Observable<DataResponse<any>> {
        const selectedKurse: Kurse = this.setupQuery.getSelectedKurse();
        const stufe = this.setupQuery.getStufe();

        return this.http.get(environment.urls.getStundenplan, {
            headers: {
                Authorization: this.appQuery.loginToken,
                'x-gw-auth': this.appQuery.credentialsToken
            }
        }).pipe(
            tap((next: DataResponse<any>) => {
                console.log(next);
                this.appService.setKurseStufeStundenplan(selectedKurse, stufe, next.data);
            })
        );
    }
}
