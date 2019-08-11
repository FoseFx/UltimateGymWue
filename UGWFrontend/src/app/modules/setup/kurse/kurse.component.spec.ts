import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KurseComponent} from './kurse.component';
import {UiModule} from '../../ui/ui.module';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {SetupService} from '../state/setup.service';
import {KurseSelectRowComponent} from './kurse-select-row/kurse-select-row.component';
import {StundenplanService} from '../services/stundenplan.service';
import {AppService} from 'src/app/state/app.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

describe('KurseComponent', () => {
  let component: KurseComponent;
  let fixture: ComponentFixture<KurseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ KurseComponent, KurseSelectRowComponent ],
      providers: [SetupQuery, SetupStore, AppQuery, AppStore, SetupService, StundenplanService, AppService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit', () => {
    component.loading = false;
    spyOn(component.setupService, 'setAvailableKurse');
    spyOn(component.setupQuery, 'getStufe').and.returnValue('Q1');
    // @ts-ignore
    component.appQuery = {loginToken: 'idk', credentialsToken: 'idke'};
    const spy = spyOn(component.http, 'get').and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.and.returnValue(of({error: true}));
    component.ngOnInit();
    expect(component.loading).toEqual(false);
    spy.and.returnValue(of({error: true}).pipe(map(_ => {
      throw new Error('unlucky');
    })));
    component.ngOnInit();
    expect(component.error).toEqual('unlucky');
  });

  it('should onSetKurse', () => {
    // @ts-ignore
    component.appQuery = {loginToken: 'idk'};
    component.loading = false;
    const spy1 = spyOn(component.setupQuery, 'getHasSelectedAllKurse').and.returnValue(false);
    component.onSetKurse();
    expect(component.loading).toEqual(false);
    component.loading = false;
    spy1.and.returnValue(true);
    spyOn(component.setupQuery, 'getSelectedKurse').and.returnValue({});
    const spSpy = spyOn(component.stundenplanService, 'getSp').and.returnValue(of({}));
    const httpSpy = spyOn(component.http, 'put').and.returnValue(of({}));
    const spy = spyOn(component.router, 'navigate');
    component.onSetKurse();
    expect(spy).toHaveBeenCalled();
  });
});
