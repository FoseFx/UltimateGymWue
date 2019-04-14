import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {UiModule} from '../../ui/ui.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ UiModule ],
      declarations: [ RegisterComponent ]
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


});
