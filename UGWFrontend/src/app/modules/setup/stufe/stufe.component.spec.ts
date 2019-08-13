import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {StufeComponent} from './stufe.component';
import {UiModule} from '../../ui/ui.module';
import {AppStore} from '../../../state/app.store';
import {SetupService} from '../state/setup.service';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {AppQuery} from '../../../state/app.query';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {StundenplanService} from '../services/stundenplan.service';
import {AppService} from '../../../state/app.service';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

describe('StufeComponent', () => {
  let component: StufeComponent;
  let fixture: ComponentFixture<StufeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ StufeComponent ],
      providers: [AppQuery, AppStore, SetupService, SetupQuery, SetupStore, StundenplanService, AppService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StufeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    // @ts-ignore
    component.appQuery = {
      hasCredentials: () => true,
      loginToken: 'whatever',
      credentialsToken: 'token'
    };
    const httpSpy = spyOn(component.http, 'get').and.returnValue(of());
    component.loading = false;
    const spy = spyOn(component.setupQuery, 'getValue').and.returnValue({justRegistered: true});
    component.ngOnInit();
    expect(component.loading).toEqual(true);
    expect(httpSpy).toHaveBeenCalled();

    spyOn(component.setupService, 'setAvailStufen');
    httpSpy.and.returnValue(of({}));
    component.ngOnInit();

    httpSpy.and.returnValue(of({}).pipe(map(_ => {throw new Error('error'); } )));
    component.ngOnInit();

    httpSpy.calls.reset();

    const basicsSpy = spyOn(component, 'fetchBasics').and.returnValue(true);
    spy.and.returnValue({justRegistered: false});
    component.ngOnInit();
    expect(basicsSpy).toHaveBeenCalled();
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('should call next', () => {
    spyOn(component.router, 'navigate').and.returnValue(Promise.resolve());
    const spy = spyOn(component.setupService, 'setStufe');
    component.next(undefined);
    expect(spy).not.toHaveBeenCalled();
    component.next('sth');
    expect(spy).toHaveBeenCalled();
  });

  it('should fetchBasics', async () => {
    const rS = spyOn(component.router, 'navigate');
    const spy = spyOn(component.stundenplanService, 'getSp').and.returnValue({toPromise: () => Promise.reject('err')});

    expect(await component.fetchBasics()).toEqual(false);
    expect(rS).not.toHaveBeenCalled();

    spy.and.returnValue({toPromise: () => Promise.resolve('err')});
    expect(await component.fetchBasics()).toEqual(true);
    expect(rS).toHaveBeenCalled();
  });
});
