import {Injectable} from '@angular/core';
import {AppService} from 'src/app/state/app.service';
import {SetupQuery} from '../state/setup.query';
import {Kurse} from 'src/types/Kurs';
import {AppQuery} from 'src/app/state/app.query';
import {DataResponse} from 'src/types/Responses';
import {Observable, of} from 'rxjs';
import {TimeTable} from '../../../../types/TT';

@Injectable()
export class StundenplanService {
  constructor(public appService: AppService,
              public setupQuery: SetupQuery,
              public appQuery: AppQuery) {}

  getSp(): Observable<DataResponse<any>> {
    const kurse: Kurse = [];
    const sp: TimeTable = [
      [[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}]],
      [[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}],[{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'},{fach: 'Demo', raum: 'R1', lehrer: 'DEM', name: 'Demo', typ: 'klasse'}]]
    ];
    const stufe = 'DEMO';
    this.appService.setKurseStufeStundenplan(kurse, stufe, sp);
    const dr: DataResponse<any> = {error: false, data: {kurse, sp, stufe}};
    return of(dr);
  }
}
