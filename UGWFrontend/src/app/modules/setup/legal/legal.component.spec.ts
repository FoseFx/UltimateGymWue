import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LegalComponent} from './legal.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SnackbarService} from '../../../services/snackbar.service';
import {TrackingService} from '../../../services/tracking.service';

describe('LegalComponent', () => {
  let component: LegalComponent;
  let fixture: ComponentFixture<LegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ LegalComponent ],
      providers: [TrackingService, SnackbarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
