import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {isLoggedIn, MenuComponent, tru} from './menu.component';
import {AppStore} from '../../state/app.store';
import {AppQuery} from '../../state/app.query';
import {AppService} from '../../state/app.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ MenuComponent ],
      providers: [
        AppStore,
        AppQuery,
        AppService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true on tru', () => {
    expect(tru()).toEqual(true);
  });
  it('should return login status', () => {
    // @ts-ignore
    const comp1: MenuComponent = {query: {isLoginned: () => true}};
    // @ts-ignore
    const comp2: MenuComponent = {query: {isLoginned: () => false}};

    expect(isLoggedIn(comp1)).toEqual(true);
    expect(isLoggedIn(comp2)).toEqual(false);
  });

});
