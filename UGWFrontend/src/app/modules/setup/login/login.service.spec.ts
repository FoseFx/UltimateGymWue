import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {AppService} from '../../../state/app.service';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {LoginService} from './login.service';
import {of} from "rxjs";

describe('LoginService', () => {
  let service: LoginService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LoginService, AppService, AppQuery, AppStore]
    });
    service = TestBed.get(LoginService);
  });

  it('should create Service', () => {
    expect(service).toBeTruthy();
  });

  it('should normalLogin', async () => {
    const spy = spyOn(service.appService, 'onLogin');
    const spy2 = spyOn(service.http, 'post').and.returnValue(of({}));
    const res = await service.normalLogin('some@test.com', 'psw').toPromise();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    // @ts-ignore
    expect(res).toEqual({});

    spy2.and.returnValue(of({error: true, msg: 'somerrr'}));
    try {
      await service.normalLogin('some@test.com', 'psw').toPromise();
    } catch (e) {
      expect(e.message).toEqual('somerrr');
    }
  });

  it('should instaLogin', async () => {
    const spy = spyOn(service.appService, 'onLogin');
    const spy2 = spyOn(service.http, 'post').and.returnValue(of({}));
    const res = await service.instaLogin('12346', 'https://').toPromise();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    // @ts-ignore
    expect(res).toEqual({});

    spy2.and.returnValue(of({error: true, msg: 'somerrr'}));
    try {
      await service.instaLogin('12346', 'https://').toPromise();
    } catch (e) {
      expect(e.message).toEqual('somerrr');
    }
  });
  it('should googleLogin', async () => {
    const spy = spyOn(service.appService, 'onLogin');
    const spy2 = spyOn(service.http, 'post').and.returnValue(of({}));
    const res = await service.googleLogin('12346').toPromise();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    // @ts-ignore
    expect(res).toEqual({});

    spy2.and.returnValue(of({error: true, msg: 'somerrr'}));
    try {
      await service.googleLogin('12346').toPromise();
    } catch (e) {
      expect(e.message).toEqual('somerrr');
    }
  });
});
