import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import {UiModule} from '../../../ui/ui.module';
import {NotificationService} from '../../../../services/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ NotificationComponent ],
      providers: [NotificationService]
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
