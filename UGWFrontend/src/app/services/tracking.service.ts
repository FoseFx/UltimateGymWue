import { Injectable } from '@angular/core';
import {SnackbarService} from './snackbar.service';

declare global {
  interface Window {
    _paq: string[][];
  }
}
@Injectable()
export class TrackingService {

  constructor(public snackbarService: SnackbarService) { }

  giveConsent() {
    if (window._paq) {
      window._paq.push(['rememberConsentGiven']);
      this.snackbarService.addSnackbar('Das Sammeln von Verhaltensdaten wurde erlaubt', 500, 'note');
    }
  }

  revokeConsent() {
    if (window._paq) {
      window._paq.push(['forgetConsentGiven']);
      this.snackbarService.addSnackbar('Das Sammeln von Verhaltensdaten wurde gestoppt.', 2000, 'warning');
    }
  }
}
