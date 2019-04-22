import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {GoogleComponent, GoogleSigninComponent} from './google.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {LoginService} from '../../login/login.service';
import {AppStore} from '../../../../state/app.store';
import {AppService} from '../../../../state/app.service';
import {AppQuery} from '../../../../state/app.query';

describe('GoogleComponent', () => {
  let component: GoogleComponent;
  let fixture: ComponentFixture<GoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ GoogleComponent, GoogleSigninComponent ],
      providers: [SetupQuery, SetupStore, LoginService, AppStore, AppService, AppQuery]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
