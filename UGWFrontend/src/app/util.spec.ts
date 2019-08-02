import {capitalizeFirstLetter, handleError, queryInCypress, serviceInCypress} from './util';
import {AppQuery} from './state/app.query';
import {AppStore} from './state/app.store';
import {AppService} from './state/app.service';
import {MakesRequests} from 'src/types/MakesRequests';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';

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

  describe('handleError', () => {

    it('Unknown Error', () => {
      const obj: MakesRequests = {error: '', loading: true};
      const err: HttpErrorResponse = new HttpErrorResponse({
        url: 'whocares://i.dont',
        statusText: 'Unknown Error',
        status: 401,
        headers: new HttpHeaders(),
        error: {}
      });
      handleError(obj, err);
      expect(obj.error).toEqual('Netzwerkfehler');
    });

    it('No error object', () => {
      const obj: MakesRequests = {error: '', loading: true};
      const err: HttpErrorResponse = new HttpErrorResponse({
        url: 'whocares://i.dont',
        statusText: 'Error',
        status: 401,
        headers: new HttpHeaders(),
        error: null
      });
      handleError(obj, err);
      expect(obj.error).toEqual(err.message);
    });

    it('msg key in err exists', () => {
      const obj: MakesRequests = {error: '', loading: true};
      const err: HttpErrorResponse = new HttpErrorResponse({
        url: 'whocares://i.dont',
        statusText: 'Error',
        status: 401,
        headers: new HttpHeaders(),
        error: {
          msg: 'Some Error message haha'
        }
      });
      handleError(obj, err);
      expect(obj.error).toEqual('Some Error message haha');
    });

    it('Should not happen I think', () => {
      const obj: MakesRequests = {error: '', loading: true};
      const err: HttpErrorResponse = new HttpErrorResponse({
        url: 'whocares://i.dont',
        statusText: 'Error',
        status: 401,
        headers: new HttpHeaders(),
        error: {}
      });
      handleError(obj, err);
      expect(obj.error).toEqual(err.message);
    });

  });

  it('should capitalizeFirstLetter', () => {
    expect(capitalizeFirstLetter('someString and so öün')).toBe('SomeString and so öün');
    expect(capitalizeFirstLetter('S')).toBe('S');
    expect(capitalizeFirstLetter('ßtest')).toBe('SStest');
  });
});
