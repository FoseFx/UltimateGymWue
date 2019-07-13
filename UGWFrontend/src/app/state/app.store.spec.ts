import {TestBed} from '@angular/core/testing';
import {AppStore, createInitialState, getVersion} from './app.store';
import {version} from '../../../package.json';

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
          version: getVersion()
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
        fullname: 'Some Name',
        loginData: 'login data',
        basics: 'basics Modified',
        credentials: 'creds Modified',
        klausuren: ['test']
      }));
      const val = createInitialState();
      expect(JSON.stringify(val)).toEqual(JSON.stringify({
        meta: {
          version: getVersion()
        },
        fullname: 'Some Name',
        loginData: 'login data',
        menuOpen: false,
        basics: 'basics Modified',
        credentials: 'creds Modified',
        thisDay: null,
        nextDay: null,
        klausuren: ['test']
      }));
    });
  });

  it('should getVersion', () => {
    expect(getVersion()).toEqual(version);
  });
});
