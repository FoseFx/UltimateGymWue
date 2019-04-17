import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {UiModule} from '../../ui/ui.module';
import {InputComponent} from '../../ui/input/input.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [UiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Validation', () => {
    let email: InputComponent;
    let password: InputComponent;
    describe('should not allow empty email field', () => {

      beforeEach(() => {
        email = new InputComponent(); // untouched
        password = new InputComponent();
      });
      it('password is empty', () => {
        // password untouched
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is invalid', () => {
        password.value = '123456';
        password.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is valid', () => {
        password.value = '1234567890';
        password.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });
    describe('should not allow invalid email field', () => {

      beforeEach(() => {
        email = new InputComponent();
        email.invalid = true;
        email.value = 'n0tanemail';
        password = new InputComponent();
      });

      it('password is empty', () => {
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is invalid', () => {
        password.value = '12345';
        password.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is valid', () => {
        password.value = '123456789';
        password.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });

    describe('should not allow password field', () => {

      beforeEach(() => {
        password = new InputComponent(); // untouched
        email = new InputComponent();
      });
      it('email is empty', () => {
        // email untouched
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is invalid', () => {
        email.value = '123456';
        email.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is valid', () => {
        email.value = 'test@test.com';
        email.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });
    describe('should not allow invalid password field', () => {

      beforeEach(() => {
        password = new InputComponent();
        password.invalid = true;
        password.value = 'n0tanemail';
        email = new InputComponent();
      });

      it('email is empty', () => {
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is invalid', () => {
        email.value = '12345';
        email.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is valid', () => {
        email.value = 'test@test.com';
        email.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });

    it('should be allow, when both valid', () => {
      email.invalid = false;
      email.value = 'test@test.com';
      password.invalid = false;
      password.value = '1234567890';
      expect(component.allow(email, password)).toEqual(true);
    });

  });

});
