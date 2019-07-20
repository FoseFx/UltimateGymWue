import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {isLoggedIn, isLoggedInAndHasPushSupport, MenuComponent, tru} from './menu.component';
import {AppStore} from '../../state/app.store';
import {AppQuery} from '../../state/app.query';
import {AppService} from '../../state/app.service';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationService} from '../../services/notification.service';

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
        AppService,
        NotificationService
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
  it('should return pushSupportAndLoginStatus', () => {
    // @ts-ignore
    const comp1: MenuComponent = {query: {isLoginned: () => true}, notificationService: {canPush: () => true}};
    expect(isLoggedInAndHasPushSupport(comp1)).toEqual(true);
    // @ts-ignore
    const comp2: MenuComponent = {query: {isLoginned: () => false}, notificationService: {canPush: () => true}};
    expect(isLoggedInAndHasPushSupport(comp2)).toEqual(false);
    // @ts-ignore
    const comp3: MenuComponent = {query: {isLoginned: () => true}, notificationService: {canPush: () => false}};
    expect(isLoggedInAndHasPushSupport(comp3)).toEqual(false);
    // @ts-ignore
    const comp4: MenuComponent = {query: {isLoginned: () => false}, notificationService: {canPush: () => false}};
    expect(isLoggedInAndHasPushSupport(comp4)).toEqual(false);
  });

});
