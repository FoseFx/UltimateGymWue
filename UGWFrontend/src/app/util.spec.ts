import {queryInCypress, serviceInCypress} from './util';
import {AppQuery} from './state/app.query';
import {AppStore} from './state/app.store';
import {AppService} from './state/app.service';

describe('util', () => {

  describe('cypress query bindings', () => {
    let query;
    beforeEach(() => {
      const store = new AppStore();
      query = new AppQuery(store);
    });

    it('should not leak query when not in cypress', () => {
      // @ts-ignore
      window.Cypress = undefined;
      queryInCypress(query);
      // @ts-ignore
      expect(window.AppQuery).not.toBeTruthy();
    });

    it('should leak query when in cypress', () => {
      // @ts-ignore
      window.Cypress = true;
      queryInCypress(query);
      // @ts-ignore
      expect(window.AppQuery).toBeTruthy();
    });

  });

  describe('cypress service bindings', () => {
    let service;
    beforeEach(() => {
      const store = new AppStore();
      const query = new AppQuery(store);
      service = new AppService(store, query);
    });

    it('should not leak service when not in cypress', () => {
      // @ts-ignore
      window.Cypress = undefined;
      serviceInCypress(service);
      // @ts-ignore
      expect(window.AppService).not.toBeTruthy();
    });

    it('should leak service when in cypress', () => {
      // @ts-ignore
      window.Cypress = true;
      serviceInCypress(service);
      // @ts-ignore
      expect(window.AppService).toBeTruthy();
    });

  });

});
