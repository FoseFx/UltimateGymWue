import {TestBed} from "@angular/core/testing";
import {AppStore, createInitialState} from "./app.store";


describe('AppStore', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStore]
    });
  });

  it('should be created', () => {
    const store = TestBed.get(AppStore);
    expect(store).toBeTruthy();
  });

  describe('createInitialState', () => {
    it('should return initState, when no localStorage present', () => {
      localStorage.clear();
      const val = createInitialState();
      expect(JSON.stringify(val)).toEqual(JSON.stringify({
        meta: {
          version: '0.0.1'
        },
        fullname: null,
        loginData: null,
        menuOpen: false,
        basics: null,
        credentials: null,
        thisDay: null,
        nextDay: null,
        klausuren: []
      }));
    });
    it('should return modified localstorage if present', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({
        meta: {
          version: 'other version.'
        },
        fullname: 'Some Name',
        loginData: null,
        menuOpen: 'sth',
        basics: null,
        credentials: null,
        thisDay: 'sth',
        nextDay: 'sth',
        klausuren: []
      }));
      const val = createInitialState();
      expect(JSON.stringify(val)).toEqual(JSON.stringify({
        meta: {
          version: 'other version.'
        },
        fullname: 'Some Name',
        loginData: null,
        menuOpen: false,
        basics: null,
        credentials: null,
        thisDay: null,
        nextDay: null,
        klausuren: []
      }));
    });
  });
});
