import { TestBed } from '@angular/core/testing';
import {hasSelAllKurse, SetupQuery} from './setup.query';
import {SelectedKurseIndexMap, SetupStore} from './setup.store';


describe('SetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SetupStore, SetupQuery]
  }));

  it('should be created', () => {
    const service: SetupQuery = TestBed.get(SetupQuery);
    expect(service).toBeTruthy();
  });


  it('should detect if all Kurse where selected func', () => {

    let map: SelectedKurseIndexMap = {};
    let bool = hasSelAllKurse(map);
    expect(bool).toEqual(true);

    map = {test: -1};
    bool = hasSelAllKurse(map);
    expect(bool).toEqual(false);


    map = {test: -1, another_test: 56};
    bool = hasSelAllKurse(map);
    expect(bool).toEqual(false);


    map = {test: 51, another_test: 56};
    bool = hasSelAllKurse(map);
    expect(bool).toEqual(true);

  });

  it('should detect if all Kurse where selected async 1', (done) => {
    const store: SetupStore = TestBed.get(SetupStore);
    const query: SetupQuery = TestBed.get(SetupQuery);

    store.update({selected_kurse_indexes: {
        one: 1,
        two: 2
    }});

    query.hasSelectedAllKurse$.subscribe((val: boolean) => {
      expect(val).toEqual(true);
      done();
    });

  });

  it('should detect if all Kurse where selected async 2', (done) => {
    const store: SetupStore = TestBed.get(SetupStore);
    const query: SetupQuery = TestBed.get(SetupQuery);

    store.update({selected_kurse_indexes: {
        one: -1,
        two: 2
    }});

    query.hasSelectedAllKurse$.subscribe((val: boolean) => {
      expect(val).toEqual(false);
      done();
    });

  });


  it('should return all unselected kurse', (done) => {
    const store: SetupStore = TestBed.get(SetupStore);
    const query: SetupQuery = TestBed.get(SetupQuery);

    store.update({selected_kurse_indexes: {
        one: 1,
        two: 2,
        three: -1,
        four: -1,
        five: 5,
        six: -1
      }});

    query.noSelectedKurse$.subscribe((arr: string[]) => {
      expect(JSON.stringify(arr)).toEqual(JSON.stringify(['three', 'four', 'six']));
      done();
    });

  });


  it('should return all selected kurse', (done) => {
    const store: SetupStore = TestBed.get(SetupStore);
    const query: SetupQuery = TestBed.get(SetupQuery);

    store.update({selected_kurse_indexes: {
        one: 0,
        two: 1,
        three: 2,
        four: 0,
        five: 0,
        six: 0
      },
      available_kurse: {
        one: [{lehrer: 'one', title: 'one', fach: 'one'}],
        two: [{lehrer: 'ok', title: 'ok', fach: 'ok'}, {lehrer: 'two', title: 'two', fach: 'two'}],
        three: [
          {lehrer: 'ok', title: 'ok', fach: 'ok'},
          {lehrer: 'ok', title: 'ok', fach: 'ok'},
          {lehrer: 'three', title: 'three', fach: 'three'}
        ],
        four: [{lehrer: 'four', title: 'four', fach: 'four'}],
        five: [{lehrer: 'five', title: 'five', fach: 'five'}],
        six: [{lehrer: 'six', title: 'six', fach: 'six'}]
      }
    });

    query.selectedKurseIndexes$.subscribe(() => {
      expect(JSON.stringify(query.getSelectedKurse())).toEqual(JSON.stringify(
        [
          {lehrer: 'one', title: 'one', fach: 'one'},
          {lehrer: 'two', title: 'two', fach: 'two'},
          {lehrer: 'three', title: 'three', fach: 'three'},
          {lehrer: 'four', title: 'four', fach: 'four'},
          {lehrer: 'five', title: 'five', fach: 'five'},
          {lehrer: 'six', title: 'six', fach: 'six'}
          ]
      ));
      done();
    });

  });




});

