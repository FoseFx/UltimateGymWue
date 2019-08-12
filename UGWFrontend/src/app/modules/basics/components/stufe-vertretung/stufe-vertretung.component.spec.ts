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

  it('should set vertretungsdaten', () => {
    component.vertretungsdaten = {infos: ['rmme'], vp: []};
    expect(component.Svertretungsdaten).toEqual({infos: [], vp: []});

    component.vertretungsdaten = {infos: ['rmme'], vp: [
      {nd: 1, date: '', fach: '', info: '', newRaum: '', oldRaum: '', stunde: '', typ: ''},
      {date: '1', fach: '1', info: '1', newRaum: '1', oldRaum: '1', stunde: '1', typ: '1'}
    ]};
    expect(component.Svertretungsdaten).toEqual({infos: [], vp: [{nd: 1, date: '', fach: '', info: '', newRaum: '', oldRaum: '', stunde: '', typ: ''}]});

  });
});
