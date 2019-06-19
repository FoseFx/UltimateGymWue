import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HiddenNonKurseComponent} from './hidden-non-kurse.component';
import {AppQuery} from '../../../../state/app.query';
import {AppService} from '../../../../state/app.service';
import {UiModule} from '../../../ui/ui.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AppStore} from '../../../../state/app.store';

describe('HiddenNonKurseComponent', () => {
  let component: HiddenNonKurseComponent;
  let fixture: ComponentFixture<HiddenNonKurseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [ HiddenNonKurseComponent ],
      providers: [AppStore, AppQuery, AppService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenNonKurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
