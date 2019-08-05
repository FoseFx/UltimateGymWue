import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KlausurenComponent} from './klausuren.component';
import {UiModule} from '../../ui/ui.module';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {SetupQuery} from '../state/setup.query';
import {SetupStore} from '../state/setup.store';
import {AppService} from '../../../state/app.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('KlausurenComponent', () => {
  let component: KlausurenComponent;
  let fixture: ComponentFixture<KlausurenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [ KlausurenComponent ],
      providers: [AppQuery, AppStore, SetupQuery, SetupStore, AppService]
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
  it('should set kurse', () => {
    spyOn(component.appQuery, 'getValue').and.returnValue({basics: {kurse: [
        {fach: 'fach1', lehrer: 'lehrer1', title: 'title1'},
        {fach: 'fach2', lehrer: 'lehrer2', title: 'title2'},
        {fach: 'Frei', lehrer: 'Frei', title: 'Frei'},
        {fach: 'fach3', lehrer: 'lehrer3', title: 'title3'}
    ]}});
    expect(component.initialKurse()).toEqual([
      {fach: 'fach1', lehrer: 'lehrer1', title: 'title1'},
      {fach: 'fach2', lehrer: 'lehrer2', title: 'title2'},
      {fach: 'fach3', lehrer: 'lehrer3', title: 'title3'}
    ]);
  });

  it('should save klausuren', () => {
    component.kurse = [
      {fach: 'fach1', lehrer: 'lehrer1', title: 'title1'},
      {fach: 'fach2', lehrer: 'lehrer2', title: 'title2'},
      {fach: 'fach3', lehrer: 'lehrer3', title: 'title3'},
      {fach: 'fach4', lehrer: 'lehrer4', title: 'title4'},
    ];
    component.active = [
      false,
      true,
      undefined,
      true
    ];
    const setSpy = spyOn(component.appService, 'setKlausuren').and.callFake((klausuren) => {
      expect(klausuren).toEqual(['fach2', 'fach4']);
    });
    const routeSpy = spyOn(component.router, 'navigate');
    component.save();
    expect(routeSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalled();
  });

  it('should call ngOnInit', () => {
    component.kurse = [
      {fach: 'fach1', lehrer: 'lehrer1', title: 'title1'},
      {fach: 'fach2', lehrer: 'lehrer2', title: 'title2'},
      {fach: 'fach3', lehrer: 'lehrer3', title: 'title3'},
      {fach: 'fach4', lehrer: 'lehrer4', title: 'title4'},
    ];
    component.active = [];
    const spy = spyOn(component.appQuery, 'getValue').and.returnValue({klausuren: []});
    component.ngOnInit();
    spy.and.returnValue({klausuren: ['fach2', 'fach4']});
    component.ngOnInit();
    expect(component.active[0]).toBeFalsy();
    expect(component.active[1]).toBeTruthy();
    expect(component.active[2]).toBeFalsy();
    expect(component.active[3]).toBeTruthy();
  });
});
