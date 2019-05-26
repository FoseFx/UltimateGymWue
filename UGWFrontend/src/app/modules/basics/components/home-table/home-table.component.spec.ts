import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTableComponent } from './home-table.component';
import {UiModule} from '../../../ui/ui.module';
import {StufeVertretungComponent} from '../stufe-vertretung/stufe-vertretung.component';

describe('HomeTableComponent', () => {
  let component: HomeTableComponent;
  let fixture: ComponentFixture<HomeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ HomeTableComponent, StufeVertretungComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
