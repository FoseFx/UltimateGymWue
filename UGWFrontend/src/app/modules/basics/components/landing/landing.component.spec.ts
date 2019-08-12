import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LandingComponent} from './landing.component';
import {HomeTableComponent} from '../home-table/home-table.component';
import {AppQuery} from 'src/app/state/app.query';
import {AppStore} from 'src/app/state/app.store';
import {UiModule} from '../../../ui/ui.module';
import {AppService} from '../../../../state/app.service';
import {HttpClientModule} from '@angular/common/http';
import {StufeVertretungComponent} from '../stufe-vertretung/stufe-vertretung.component';
import {BasicsStore} from '../../state/basics.store';
import {BasicsQuery} from '../../state/basics.query';
import {BasicsService} from '../../state/basics.service';
import {UnhtmlPipe} from '../stufe-vertretung/unhtml.pipe';
import {ExtractStyleTagsPipe} from '../stufe-vertretung/extract-style-tags.pipe';
import {BasicsPopupComponent} from '../basics-popup/basics-popup.component';
import {KeyService} from '../../../../services/key.service';
import {HasNetworkService} from '../../../../services/has-network.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {of} from "rxjs";
import {map} from "rxjs/operators";

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
      declarations: [
        LandingComponent,
        HomeTableComponent,
        StufeVertretungComponent,
        UnhtmlPipe,
        ExtractStyleTagsPipe,
        BasicsPopupComponent],
      providers: [AppQuery, AppStore, AppService, BasicsStore, BasicsQuery, BasicsService, KeyService, SnackbarService, HasNetworkService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    component.appQuery.__store__.update({
      basics: {
        stundenplan: [
          [[], [], [], [], []],
          [[], [], [], [], []]
        ],
        kurse: [],
        stufe: '',
        stufe_id: '',
        vertretungsplan: null,
        stundenplanWithInfos: null,
        hiddenNonKurse: [],
        vdFetchedAt: null
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen to key events', () => {
    component.activeTab = 0;
    component.keyService.leftRightlistener$ = of(KeyService.RIGHT_EVENT);
    component.ngOnInit();
    expect(component.activeTab).toEqual(1);
  });

  it('should call onAfterViewInit', () => {
    component.loading = false;
    const spy = spyOn(component.http, 'get').and.returnValue(of());
    // @ts-ignore
    component.appQuery = {getValue: () => ({loginData: true, basics: {stufe: 'st'}}), logintoken: 'token', credentialsToken: 'nah'};
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
    expect(component.loading).toEqual(true);

    const stub = spyOn(component.appService, 'setVertretungsplan');
    spy.and.returnValue(of({}));
    component.ngAfterViewInit();
    expect(component.loading).toEqual(false);
    expect(stub).toHaveBeenCalled();

    spy.and.returnValue(of({}).pipe(map(_ => {throw new Error('unlucky'); } )));
    component.ngAfterViewInit();
  });

});
