import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SnackbarComponent} from './snackbar.component';
import {SnackbarService} from '../../services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ SnackbarComponent ],
      providers: [SnackbarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    component.snackbarService.addSnackbar('Message');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute function', () => {
    let called = false;
    spyOn(component.snackbarService, 'getNewSnackbar').and.returnValue({
      id: 1,
      type: 'note',
      msg: 'ok',
      actions: {test: () => called = true},
      setTimeout: undefined,
      ttl: 100000,
      startedAt: +new Date(),
      queue: [],
      close: () => {
        this.ttl = 0;
        this.queue.splice(0, 1);
      }
    });
    fixture.detectChanges();
    component.executeFunction('test');
    expect(called).toBeTruthy();
  });
});
