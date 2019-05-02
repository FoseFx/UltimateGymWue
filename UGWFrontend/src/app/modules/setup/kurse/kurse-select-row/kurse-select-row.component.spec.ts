import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KurseSelectRowComponent } from './kurse-select-row.component';
import {SetupQuery} from '../../state/setup.query';
import {SetupService} from '../../state/setup.service';
import {SetupStore} from '../../state/setup.store';

describe('KurseSelectRowComponent', () => {
  let component: KurseSelectRowComponent;
  let fixture: ComponentFixture<KurseSelectRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KurseSelectRowComponent ],
      providers: [SetupQuery, SetupService, SetupStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KurseSelectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
