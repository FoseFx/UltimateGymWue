import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CredentialsComponent} from './credentials.component';
import {UiModule} from '../../ui/ui.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AppService} from '../../../state/app.service';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {HttpClientModule} from '@angular/common/http';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {of} from "rxjs";
import {map} from "rxjs/operators";

describe('CredentialsComponent', () => {
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, HttpClientModule],
      declarations: [ CredentialsComponent ],
      providers: [AppService, AppQuery, AppStore, SetupQuery, SetupStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    spyOn(component.query, 'getValue').and.returnValue({loginData: 's'});
    spyOn(component.setupQuery, 'getValue').and.returnValue({justRegistered: false});
    const spy = spyOn(component.http, 'get').and.returnValue(of({}));
    spyOn(component.service, 'addCreds');
    spyOn(component.router, 'navigate');
    component.loading = false;
    component.ngOnInit();

    spy.and.returnValue(of({}).pipe(map(_ => { throw new Error(); })));
    component.ngOnInit();
  });

  it('should handle click', () => {
    component.loading = false;
    // @ts-ignore
    component.query = {loginToken: ''};
    spyOn(component.router, 'navigate');
    spyOn(component.service, 'addCreds');
    const httpSpy = spyOn(component.http, 'post').and.returnValue(of({}));
    // @ts-ignore
    component.onClick({}, {});
    expect(component.loading).toEqual(true);

    httpSpy.and.returnValue(of({}).pipe(map(_ => { throw new Error(); })));
    // @ts-ignore
    component.onClick({}, {});
  });
});
