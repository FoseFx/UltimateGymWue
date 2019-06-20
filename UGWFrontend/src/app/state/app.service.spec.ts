import {TestBed} from '@angular/core/testing';
import {AppStore} from './app.store';
import {AppService, getProvider, isGoogle, isInsta, isNormal} from './app.service';
import {AppQuery} from './app.query';
import {LoginResponse} from '../modules/setup/login/login.service';


describe('AppService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStore, AppService, AppQuery]
    });
  });

  describe('changeMenuState', () => {
    it('should swap from false to true', () => {
      const service: AppService = TestBed.get(AppService);
      const store: AppStore = TestBed.get(AppStore);
      service.changeMenuState();
      expect(store._value().menuOpen).toEqual(true);
    });
    it('should swap from true to false', () => {
      const service: AppService = TestBed.get(AppService);
      const store: AppStore = TestBed.get(AppStore);
      store.update({menuOpen: true});
      service.changeMenuState();
      expect(store._value().menuOpen).toEqual(false);
    });
  });

  describe('onLogin', () => {


    it('should test getProvider', () => {
      // @ts-ignore
      expect(getProvider({data: {claim: {provider: ['normal']}}})).toEqual(['normal']);
      // @ts-ignore
      expect(getProvider({data: {claim: {provider: ['google']}}})).toEqual(['google']);
      // @ts-ignore
      expect(getProvider({data: {claim: {provider: ['insta']}}})).toEqual(['insta']);
    });

    it('should test isGoogle', () => {
      // @ts-ignore
      expect(isGoogle({data: {claim: {provider: ['normal']}}})).toEqual(false);
      // @ts-ignore
      expect(isGoogle({data: {claim: {provider: ['google']}}})).toEqual(true);
    });

    it('should test isInsta', () => {
      // @ts-ignore
      expect(isInsta({data: {claim: {provider: ['normal']}}})).toEqual(false);
      // @ts-ignore
      expect(isInsta({data: {claim: {provider: ['insta']}}})).toEqual(true);
    });

    it('should test isNormal', () => {
      // @ts-ignore
      expect(isNormal({data: {claim: {provider: ['insta']}}})).toEqual(false);
      // @ts-ignore
      expect(isNormal({data: {claim: {provider: ['normal']}}})).toEqual(true);
    });

    it('should update on Normal', () => {
      const resp: LoginResponse = {
        data: {
          claim: {
            provider: ['normal'],
            normal: {
              email: 't',
              email_verified: false
            },
            fullname: 'Some Name',
            uid: '1',
            insta: null,
            google: null
          },
          token: ''
        },
        msg: '',
        error: false
      };
      let called = 0;
      const service: AppService = TestBed.get(AppService);

      spyOn(service.store, 'update').and.callFake((val) => {
        called++;
        if (called === 1) {
          expect(JSON.stringify(val, null, 2)).toEqual(JSON.stringify({
            loginData: {
              uid: resp.data.claim.uid,
              token: resp.data.token,
              provider: ['normal'],
              google: null,
              insta: null,
              normal: {
                email: resp.data.claim.normal.email,
                email_verified: resp.data.claim.normal.email_verified,
              }
            }
          }, null, 2));
        } else if (called === 2) {
          expect(val.fullname).toEqual(resp.data.claim.fullname);
        }
      });

      service.onLogin(resp);

    });

    it('should update on Google', () => {
      const resp: LoginResponse = {
        data: {
          claim: {
            provider: ['google'],
            normal: null,
            fullname: 'Some Name',
            uid: '1',
            insta: null,
            google: {
              email: 't',
              gid: '1'
            }
          },
          token: ''
        },
        msg: '',
        error: false
      };
      let called = 0;
      const service: AppService = TestBed.get(AppService);

      spyOn(service.store, 'update').and.callFake((val) => {
        called++;
        if (called === 1) {
          expect(JSON.stringify(val, null, 2)).toEqual(JSON.stringify({
            loginData: {
              uid: resp.data.claim.uid,
              token: resp.data.token,
              provider: ['google'],
              normal: null,
              insta: null,
              google: {
                email: resp.data.claim.google.email,
                gid: resp.data.claim.google.gid,
              }
            }
          }, null, 2));
        } else if (called === 2) {
          expect(val.fullname).toEqual(resp.data.claim.fullname);
        }
      });

      service.onLogin(resp);

    });

    it('should update on insta', () => {
      const resp: LoginResponse = {
        data: {
          claim: {
            provider: ['insta'],
            normal: null,
            fullname: 'Some Name',
            uid: '1',
            insta: {
              iid: '1',
              token: '1'
            },
            google: null
          },
          token: ''
        },
        msg: '',
        error: false
      };
      let called = 0;
      const service: AppService = TestBed.get(AppService);

      spyOn(service.store, 'update').and.callFake((val) => {
        called++;
        if (called === 1) {
          expect(JSON.stringify(val, null, 2)).toEqual(JSON.stringify({
            loginData: {
              uid: resp.data.claim.uid,
              token: resp.data.token,
              provider: ['insta'],
              normal: null,
              google: null,
              insta: {
                iid: resp.data.claim.insta.iid,
                token: resp.data.claim.insta.token
              },
            }
          }, null, 2));
        } else if (called === 2) {
          expect(val.fullname).toEqual(resp.data.claim.fullname);
        }
      });

      service.onLogin(resp);

    });

  });



});
