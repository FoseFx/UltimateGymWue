import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { HomeTableComponent } from '../home-table/home-table.component';
import { AppQuery } from 'src/app/state/app.query';
import { AppStore } from 'src/app/state/app.store';
import { of } from 'rxjs';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent, HomeTableComponent ],
      providers: [AppQuery, AppStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    component.appQuery.__store__.update({
      basics: {
        stundenplan: [
          [[], [], [], [], []], 
          [[], [], [], [], []]
        ],
        kurse: [],
        stufe: "",
        stufe_id: ""
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
