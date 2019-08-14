import {AppStore} from '../../../state/app.store';
import {AppQuery} from '../../../state/app.query';
import {AppService} from '../../../state/app.service';
import {StundenplanService} from './stundenplan.service';
import {HttpClientModule} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {of} from "rxjs";


describe('StundenplanService', () => {
  let service: StundenplanService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [StundenplanService, AppService, AppQuery, AppStore, SetupQuery, SetupStore]
    });
    service = TestBed.get(StundenplanService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return Sp', async () => {
    // @ts-ignore
    service.appQuery = {loginToken: '', credentialsToken: ''};
    spyOn(service.appService, 'setKurseStufeStundenplan');
    const http = spyOn(service.http, 'get').and.returnValue(of({
      data: {
        kurse: '',
        sp: '',
        stufe: ''
      }
    }));
    const res = await service.getSp().toPromise();
    console.log('the res is', res);
  });
});
