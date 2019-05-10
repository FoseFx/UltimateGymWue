import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StufeComponent } from './stufe.component';
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
});
