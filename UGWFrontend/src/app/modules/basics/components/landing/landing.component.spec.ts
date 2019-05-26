import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { HomeTableComponent } from '../home-table/home-table.component';
import { AppQuery } from 'src/app/state/app.query';
import { AppStore } from 'src/app/state/app.store';
import {UiModule} from '../../../ui/ui.module';
import {AppService} from '../../../../state/app.service';
import {HttpClientModule} from '@angular/common/http';
import {StufeVertretungComponent} from '../stufe-vertretung/stufe-vertretung.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
      declarations: [ LandingComponent, HomeTableComponent, StufeVertretungComponent ],
      providers: [AppQuery, AppStore, AppService]
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
