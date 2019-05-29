import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StufeVertretungComponent} from './stufe-vertretung.component';
import {UnhtmlPipe} from './unhtml.pipe';
import {ExtractStyleTagsPipe} from './extract-style-tags.pipe';

describe('StufeVertretungComponent', () => {
  let component: StufeVertretungComponent;
  let fixture: ComponentFixture<StufeVertretungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StufeVertretungComponent, UnhtmlPipe, ExtractStyleTagsPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StufeVertretungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
