import { Injectable } from '@angular/core';
import { AppService } from 'src/app/state/app.service';
import { SetupQuery } from '../state/setup.query';
import { HttpClient } from 'selenium-webdriver/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class StundenplanService {
    constructor(private appService: AppService, private setupQuery: SetupQuery, private http: HttpClient){}

    getSp() {
        const selectedKurse = this.setupQuery.getSelectedKurse();
    
        // todo get Stundenplan and set AppStore and route

        
    }
}
