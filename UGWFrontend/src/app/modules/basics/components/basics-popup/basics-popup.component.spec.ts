import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicsPopupComponent} from './basics-popup.component';
import {BasicsStore} from '../../state/basics.store';
import {BasicsQuery} from '../../state/basics.query';
import {BasicsService} from '../../state/basics.service';
import {UiModule} from '../../../ui/ui.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppStore} from "../../../../state/app.store";
import {AppService} from "../../../../state/app.service";
import {AppQuery} from "../../../../state/app.query";

describe('BasicsPopupComponent', () => {
  let component: BasicsPopupComponent;
  let fixture: ComponentFixture<BasicsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, BrowserAnimationsModule],
      declarations: [ BasicsPopupComponent ],
      providers: [BasicsStore, BasicsQuery, BasicsService, AppStore, AppQuery, AppService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
