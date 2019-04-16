import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalComponent } from './normal.component';
import {UiModule} from '../../../ui/ui.module';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {HttpClientModule} from '@angular/common/http';

describe('NormalComponent', () => {
  let component: NormalComponent;
  let fixture: ComponentFixture<NormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalComponent ],
      imports: [UiModule, HttpClientModule],
      providers: [SetupQuery, SetupStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
