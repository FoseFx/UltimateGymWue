import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KlausurenComponent} from './klausuren.component';
import {UiModule} from '../../ui/ui.module';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';

describe('KlausurenComponent', () => {
  let component: KlausurenComponent;
  let fixture: ComponentFixture<KlausurenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ KlausurenComponent ],
      providers: [AppQuery, AppStore, SetupQuery, SetupStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlausurenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
