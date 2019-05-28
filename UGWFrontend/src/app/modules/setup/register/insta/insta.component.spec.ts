import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstaComponent} from './insta.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {AppService} from '../../../../state/app.service';
import {AppStore} from '../../../../state/app.store';
import {AppQuery} from '../../../../state/app.query';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupService} from '../../state/setup.service';

describe('InstaComponent', () => {
  let component: InstaComponent;
  let fixture: ComponentFixture<InstaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ InstaComponent ],
      providers: [SetupQuery, SetupStore, AppService, AppStore, AppQuery, SetupService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
