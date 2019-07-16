import {TestBed} from '@angular/core/testing';
import {AppState, AppStore} from './app.store';
import {
  AppService,
  dateSplitToDayOfWeekAndABWoche,
  getCurrentYear,
  getProvider,
  isGoogle,
  isInsta,
  isNormal,
  tokenHasLehrer
} from './app.service';
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

  describe('addCreds', () => {

    describe('tokenHasLehrer', () => {
      it('should return true', () => {
        const token = 'idk.' + btoa(JSON.stringify({lehrer: 'exists'}));
        expect(tokenHasLehrer(token)).toEqual(true);
      });
      it('should return false', () => {
        const token = 'idk.' + btoa(JSON.stringify({}));
        expect(tokenHasLehrer(token)).toEqual(false);
      });
    });

    it('should test addCreds once', () => {
      const service: AppService = TestBed.get(AppService);
      const token = 'idk.' + btoa(JSON.stringify({lehrer: 'exists'}));
      const updateSpy = spyOn(service.store, 'update').and.callFake((v) => {
        expect(v).toEqual({credentials: {token, has_lehrer: true}});
      });
      const saveSpy = spyOn(service, '_save');
      service.addCreds(token);
      expect(saveSpy.calls.count()).toEqual(1);
    });

    it('should test addCreds twice', () => {
      const service: AppService = TestBed.get(AppService);
      const token = 'idk.' + btoa(JSON.stringify({}));
      const updateSpy = spyOn(service.store, 'update').and.callFake((v) => {
        expect(v).toEqual({credentials: {token, has_lehrer: false}});
      });
      const saveSpy = spyOn(service, '_save');
      service.addCreds(token);
      expect(saveSpy.calls.count()).toEqual(1);
    });

  });

  it('should set KurseStufeStundenplan', () => {
    const service: AppService = TestBed.get(AppService);
    const updateSpy = spyOn(service.store, 'update').and.callFake((v) => {
      expect(v).toEqual({
        basics: {
          stufe: 'stufe',
          stufe_id: null,
          kurse: 'kurse',
          stundenplan: 'sp',
          stundenplanWithInfos: 'sp',
          vertretungsplan: null,
          hiddenNonKurse: [],
          vdFetchedAt: null
        }
      });
    });
    const saveSpy = spyOn(service, '_save');
    // @ts-ignore
    service.setKurseStufeStundenplan('kurse', 'stufe', 'sp');
    expect(saveSpy.calls.count()).toEqual(1);
  });

  it('should set Klausuren', () => {
    const service: AppService = TestBed.get(AppService);
    const updateSpy = spyOn(service.store, 'update').and.callFake((v) => {
      expect(v).toEqual({
        klausuren: 'klausuren'
      });
    });
    const saveSpy = spyOn(service, '_save');
    // @ts-ignore
    service.setKlausuren('klausuren');
    expect(saveSpy.calls.count()).toEqual(1);
  });

  it('should return mutalbebasicsoject', () => {
    // @ts-ignore
    const sample: AppState = {basics: {}};
    const service: AppService = TestBed.get(AppService);
    spyOn(service.query, 'getValue').and.returnValue(sample);
    // test value
    const val = service._getMutableBasicObject();
    expect(val).toEqual(sample.basics);
    // try to modify
    val.stufe = 'test';
  });

  describe('hiddenNonKurse', () => {
    it('should test hideNonKurs with existing values',  () => {
      const service: AppService = TestBed.get(AppService);
      const saveSpy = spyOn(service, '_save');
      spyOn(service, '_getMutableBasicObject').and.returnValue({hiddenNonKurse: ['existing', 'values']});
      spyOn(service.store, 'update').and.callFake((val) => {
        expect(val.basics.hiddenNonKurse).toEqual(['test', 'existing', 'values']);
      });
      service.hideNonKurs('test');
      expect(saveSpy.calls.count()).toEqual(1);
    });
    it('should test hideNonKurs without existing values',  () => {
      const service: AppService = TestBed.get(AppService);
      const saveSpy = spyOn(service, '_save');
      spyOn(service, '_getMutableBasicObject').and.returnValue({});
      spyOn(service.store, 'update').and.callFake((val) => {
        expect(val.basics.hiddenNonKurse).toEqual(['test']);
      });
      service.hideNonKurs('test');
      expect(saveSpy.calls.count()).toEqual(1);
    });
  });

  describe('unHideNonKurse', () => {
    it('should test unHideNonKurse with existing values',  () => {
      const service: AppService = TestBed.get(AppService);
      const saveSpy = spyOn(service, '_save');
      spyOn(service, '_getMutableBasicObject').and.returnValue({hiddenNonKurse: ['existing', 'values']});
      spyOn(service.store, 'update').and.callFake((val) => {
        expect(val.basics.hiddenNonKurse).toEqual(['values']);
      });
      service.unHideNonKurse('existing');
      expect(saveSpy.calls.count()).toEqual(1);
    });
    it('should test unHideNonKurse without existing values',  () => {
      const service: AppService = TestBed.get(AppService);
      const saveSpy = spyOn(service, '_save');
      spyOn(service, '_getMutableBasicObject').and.returnValue({});
      spyOn(service.store, 'update').and.callFake((val) => {
        expect(val.basics.hiddenNonKurse).toEqual([]);
      });
      service.unHideNonKurse('test');
      expect(saveSpy.calls.count()).toEqual(1);
    });
  });

  describe('_isMyKlausur', () => {

    it('should return false on non-klausur data', () => {
      const service: AppService = TestBed.get(AppService);
      // @ts-ignore
      expect(service._isMyKlausur({typ: 'eva'})).toEqual(false);
    });

    it('should return false if not in klausuren', () => {
      const service: AppService = TestBed.get(AppService);
      spyOn(service.query, 'getValue').and.returnValue({klausuren: ['test', 'test2']});
      // @ts-ignore
      expect(service._isMyKlausur({typ: 'k', info: 'test3 sth else3'})).toEqual(false);
    });

    it('should return true if in klausuren', () => {
      const service: AppService = TestBed.get(AppService);
      spyOn(service.query, 'getValue').and.returnValue({klausuren: ['test', 'test2']});
      // @ts-ignore
      expect(service._isMyKlausur({typ: 'k', info: 'test2 sth else3'})).toEqual(true);
    });

  });

  describe('setVertretungsplan', () => {
    it('should getCurrentYear', () => {
      const d = new Date(2000, 5, 17);
      jasmine.clock().mockDate(d);
      expect(getCurrentYear()).toEqual(2000);
    });
    it('should test dateSplitToDayOfWeekAndABWoche', () => {
      const d = new Date(2019, 5, 17);
      jasmine.clock().mockDate(d);
      expect(dateSplitToDayOfWeekAndABWoche('17.05.')).toEqual({index: 4, abIndex: 0});
      expect(dateSplitToDayOfWeekAndABWoche('17.5.')).toEqual({index: 4, abIndex: 0});
      expect(dateSplitToDayOfWeekAndABWoche('16.5.')).toEqual({index: 3, abIndex: 0});
      expect(dateSplitToDayOfWeekAndABWoche('20.5.')).toEqual({index: 0, abIndex: 1});
    });
    it('should ', () => {
      const data = {stundenplanWithInfos: null, stundenplan: [
          [[{name: 'test'}, {name: 'test'}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}]],
          [[{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}]]
        ], klausuren: ['test']};
      const service: AppService = TestBed.get(AppService);
      spyOn(service, '_getMutableBasicObject').and.returnValue(data);
      spyOn(service.query, 'getValue').and.returnValue(data);
      const upSpy = spyOn(service.store, 'update').and.callFake((val) => {
        const spwI = val.basics.stundenplanWithInfos[0][0]; // erster tag
        expect(spwI[0].vd).toEqual({stunde: '1', date: '24.6.', info: 'test', fach: 'test', typ: 'eva'});
        expect(spwI[1].vd).toEqual({stunde: '2', date: '24.6.', typ: 'k', info: 'idk test', fach: ''});
      });
      // @ts-ignore
      // tslint:disable-next-line:max-line-length
      service.setVertretungsplan([{infos: [], vp: [{stunde: '1 - 2', info: 'pls ingore me'}, {stunde: '1', date: '24.6.', info: 'test', fach: 'test', typ: 'raum-vtr.'}, {stunde: '1', date: '24.6.', info: 'test', fach: 'test', typ: 'eva'}, {stunde: '2', date: '24.6.', typ: 'k', info: 'idk test', fach: ''}, {stunde: '2', date: '24.6.', typ: 'eva', fach: 'test'}]}, {infos: [], vp: null} ]);
      expect(upSpy.calls.count()).toEqual(1);
    });
  });


});
