import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeTableComponent} from './home-table.component';
import {UiModule} from '../../../ui/ui.module';
import {StufeVertretungComponent} from '../stufe-vertretung/stufe-vertretung.component';
import {BasicsStore} from '../../state/basics.store';
import {BasicsService} from '../../state/basics.service';
import {UnhtmlPipe} from '../stufe-vertretung/unhtml.pipe';
import {ExtractStyleTagsPipe} from '../stufe-vertretung/extract-style-tags.pipe';
import {VertretungsPlanSeite} from "../../../../state/app.store";
import {TimeTableField} from "../../../../../types/TT";

describe('HomeTableComponent', () => {
  let component: HomeTableComponent;
  let fixture: ComponentFixture<HomeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ HomeTableComponent, StufeVertretungComponent, UnhtmlPipe, ExtractStyleTagsPipe ],
      providers: [BasicsStore, BasicsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set vd', () => {
    component.date = new Date(2019, 7, 20);
    // no vd for stufe found
    component.vd = [null, null];
    expect(component.noVDFound).toBe(false);
    // matching vd found
    // @ts-ignore
    let fakeVd: VertretungsPlanSeite = {infos: ['20.8.2019'], vp: ['test']};
    component.vd = [null, fakeVd];
    expect(component.noVDFound).toBe(false);
    expect(component.Svd).toBe(fakeVd);

    // non matching vd for a day found

    // @ts-ignore
    fakeVd = {infos: ['21.8.2019'], vp: ['test2']};
    component.vd = [null, fakeVd];
    expect(component.noVDFound).toBe(false);
    expect(component.Svd).not.toBe(fakeVd);

    // non matching vd at all found

    // @ts-ignore
    component.vd = [{infos: ['21.8.2019'], vp: ['test2']}, {infos: ['22.8.2019'], vp: ['test2']}];
    expect(component.noVDFound).toBe(true);

  });

  it('should open popup on click', () => {
    // @ts-ignore
    const fakeStunde: TimeTableField = 'a string for the test';
    const spy = spyOn(component.basicsService, 'newPopup').and.callFake((arg) => {
      expect(arg.stunde).toBe(fakeStunde);
    });
    component.onTrClick(fakeStunde);
    expect(spy).toHaveBeenCalled();
  });

  it('should showVD', () => {
    component.Svd = null;
    expect(component.showVD).toBe(false);
    component.Svd = {vp: null, infos: ['whatever']};
    expect(component.showVD).toBe(false);
    component.Svd = {vp: null, infos: ['whatever', 'sth else']};
    expect(component.showVD).toBe(true);
    // @ts-ignore
    component.Svd = {vp: ['idk'], infos: ['whatever']};
    expect(component.showVD).toBe(true);
  });
});
