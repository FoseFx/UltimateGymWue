import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import {UiModule} from '../../../ui/ui.module';
import {NotificationService} from '../../../../services/notification.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SnackbarService} from 'src/app/services/snackbar.service';
import {AppService} from 'src/app/state/app.service';
import {AppQuery} from 'src/app/state/app.query';
import {AppStore} from 'src/app/state/app.store';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientTestingModule],
      declarations: [ NotificationComponent ],
      providers: [NotificationService, AppQuery, AppService, AppStore, SnackbarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
