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
});
