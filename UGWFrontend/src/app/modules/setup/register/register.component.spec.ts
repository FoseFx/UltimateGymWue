import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {UiModule} from '../../ui/ui.module';
import {SetupStore} from '../state/setup.store';
import {SetupService} from '../state/setup.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ UiModule, RouterTestingModule, ],
      declarations: [ RegisterComponent ],
      providers: [SetupStore, SetupService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Name Regex', () => {
    //
    // if you change these, also change the cypress test
    //

    it('should validate "Some Name"', ((done) => {
      component.name$.next('Some Name');
      component.nameValid$.subscribe((value: boolean) => {
        expect(value).toBe(true);
        done();
      });
    }));

    it('should not validate "SomeName"', ((done) => {
      component.name$.next('SomeName');
      component.nameValid$.subscribe((value: boolean) => {
        expect(value).toBe(false);
        done();
      });
    }));

    it('should not validate "some name"', ((done) => {
      component.name$.next('some name');
      component.nameValid$.subscribe((value: boolean) => {
        expect(value).toBe(false);
        done();
      });
    }));

    it('should validate "Äößsad Öjasndü"', ((done) => {
      component.name$.next('Äößsad Öjasndü');
      component.nameValid$.subscribe((value: boolean) => {
        expect(value).toBe(true);
        done();
      });
    }));

    it('should not validate "Äö4ßsad Ö1jasndü"', ((done) => {
      component.name$.next('Äö4ßsad Ö1jasndü');
      component.nameValid$.subscribe((value: boolean) => {
        expect(value).toBe(false);
        done();
      });
    }));


  });

  describe('onClick', () => {

    it('should lock full name, when valid', () => {
      inject([SetupStore, SetupService], ((store: SetupStore, service: SetupService) => {

        const spy = spyOn(service, 'lockName');
        spy.and.callFake((val: string) => {
          expect(val).toEqual('Some Name');
        });
        // @ts-ignore
        component.name = 'Some Name';
        // @ts-ignore
        component.nameValid = true;
        component.onClick('normal');
        expect(service.lockName).toHaveBeenCalled();

      }))();
    });


    it('should not lock full name, when not valid', () => {
      inject([SetupStore, SetupService], ((store: SetupStore, service: SetupService) => {

        const spy = spyOn(service, 'lockName');
        spy.and.callFake((val: string) => {
          expect(val).toEqual('Somename');
        });
        // @ts-ignore
        component.name = 'Somename';
        // @ts-ignore
        component.nameValid = false;
        component.onClick('normal');
        expect(service.lockName).not.toHaveBeenCalled();

      }))();
    });


  });


});
