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
      providers: [AppQuery, AppStore, AppService, BasicsStore, BasicsQuery, BasicsService, KeyService]
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
        stundenplanWithInfos: null
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
