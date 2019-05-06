import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KurseComponent } from './kurse.component';
import {UiModule} from '../../ui/ui.module';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {SetupService} from '../state/setup.service';
import {KurseSelectRowComponent} from './kurse-select-row/kurse-select-row.component';
import { StundenplanService } from '../services/stundenplan.service';
import { AppService } from 'src/app/state/app.service';

describe('KurseComponent', () => {
  let component: KurseComponent;
  let fixture: ComponentFixture<KurseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
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
});
