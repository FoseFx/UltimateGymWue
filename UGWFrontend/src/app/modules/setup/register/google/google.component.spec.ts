import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {GoogleComponent, GoogleSigninComponent} from './google.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';

describe('GoogleComponent', () => {
  let component: GoogleComponent;
  let fixture: ComponentFixture<GoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
      declarations: [ GoogleComponent, GoogleSigninComponent ]
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
