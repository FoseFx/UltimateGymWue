import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KurseComponent } from './kurse.component';
import {UiModule} from '../../ui/ui.module';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {SetupService} from '../state/setup.service';

describe('KurseComponent', () => {
  let component: KurseComponent;
  let fixture: ComponentFixture<KurseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule],
      declarations: [ KurseComponent ],
      providers: [SetupQuery, SetupStore, AppQuery, AppStore, SetupService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
