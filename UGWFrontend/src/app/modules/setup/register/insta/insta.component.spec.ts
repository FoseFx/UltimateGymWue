import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaComponent } from './insta.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';

describe('InstaComponent', () => {
  let component: InstaComponent;
  let fixture: ComponentFixture<InstaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
      declarations: [ InstaComponent ],
      providers: [SetupQuery, SetupStore]
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
