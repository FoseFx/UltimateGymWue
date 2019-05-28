import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstaLoginComponent} from './insta-login.component';
import {UiModule} from '../../../ui/ui.module';
import {AppService} from '../../../../state/app.service';
import {AppStore} from '../../../../state/app.store';
import {LoginService} from '../login.service';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../../state/app.query';
import {RouterTestingModule} from '@angular/router/testing';

describe('InstaLoginComponent', () => {
  let component: InstaLoginComponent;
  let fixture: ComponentFixture<InstaLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ InstaLoginComponent ],
      providers: [AppQuery, AppService, AppStore, LoginService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
