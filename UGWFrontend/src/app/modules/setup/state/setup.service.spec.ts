import {TestBed} from '@angular/core/testing';
import {kurseSortFn, SetupService} from './setup.service';
import {SetupStore} from './setup.store';
import {SetupQuery} from './setup.query';


describe('SetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SetupStore, SetupService, SetupQuery]
  }));

  it('should be created', () => {
    const service: SetupService = TestBed.get(SetupService);
    expect(service).toBeTruthy();
  });


  it('should set the name', () => {
    const service: SetupService = TestBed.get(SetupService);
    const query: SetupQuery = TestBed.get(SetupQuery);

    service.lockName('test');

    expect(query.getValue().name).toEqual('test');
  });

  it('should just register', () => {
    const service: SetupService = TestBed.get(SetupService);
    const query: SetupQuery = TestBed.get(SetupQuery);

    expect(query.getValue().justRegistered).toEqual(false); // initial state

    service.justRegistered();
    expect(query.getValue().justRegistered).toEqual(true);

  });

  it('should setAvailStufen', () => {
    const service: SetupService = TestBed.get(SetupService);
    const someStufen = ['Q1', 'EF'];
    const spy = spyOn(service.store, 'update').and.callFake(obj => {
      expect(obj).toEqual({available_stufen: someStufen});
    });
    service.setAvailStufen(someStufen);
    expect(spy).toHaveBeenCalled();
  });
  it('should setStufe', () => {
    const service: SetupService = TestBed.get(SetupService);
    const theStufe = 'EF';
    const spy = spyOn(service.store, 'update').and.callFake(obj => {
      expect(obj).toEqual({stufe: theStufe});
    });
    service.setStufe(theStufe);
    expect(spy).toHaveBeenCalled();
  });

  it('should changeSelectedIndex', () => {
    const service: SetupService = TestBed.get(SetupService);
    const title = 'title';
    const index = 0;
    const cmpObj = {title: index, other: 1};
    spyOn(service.query, 'getValue').and.returnValue({selected_kurse_indexes: {other: 1}});
    const spy = spyOn(service.store, 'update').and.callFake(obj => {
      expect(obj).toEqual({selected_kurse_indexes: cmpObj});
    });
    service.changeSelectedStufeIndex(title, index);
    expect(spy).toHaveBeenCalled();
  });

  it('should sort kurse', () => {
    // @ts-ignore
    expect(kurseSortFn({title: 'LKD2'}, {title: 'LKM1'})).toEqual(-1);
    // @ts-ignore
    expect(kurseSortFn({title: 'LKD2'}, {title: 'M1'})).toEqual(-1);
    // @ts-ignore
    expect(kurseSortFn({title: 'D2'}, {title: 'LKM1'})).toEqual(1);
    // @ts-ignore
    expect(kurseSortFn({title: 'B2'}, {title: 'A1'})).toEqual(1);
    // @ts-ignore
    expect(kurseSortFn({title: 'A2'}, {title: 'B1'})).toEqual(-1);
    // @ts-ignore
    expect(kurseSortFn({title: 'A1'}, {title: 'A1'})).toEqual(0);
  });

  it('should setAvailableKurse', () => {
    const service: SetupService = TestBed.get(SetupService);
    const spy = spyOn(service.store, 'update').and.callFake(v => {
      console.log('abcdefg', v);
      expect(v).toEqual({
        available_kurse: {
          title1: [
            {fach: 'Frei', lehrer: '', title: 'title1'},
            {title: 'title1', lehrer: 'l1', fach: 'f1'},
            {title: 'title1', lehrer: 'l1', fach: 'f1'}
            ]
        },
        selected_kurse_indexes: {title1: -1}
      });
    });
    service.setAvailableKurse([
      {title: 'title1', lehrer: 'l1', fach: 'f1'},
      {title: 'title1', lehrer: 'l1', fach: 'f1'}
    ]);
    expect(spy).toHaveBeenCalled();
  });
});

