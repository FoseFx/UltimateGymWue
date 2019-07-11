import { Component } from '@angular/core';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {

  constructor(public snackbarService: SnackbarService) { }

  keysOfCurrentSnackbar(): string[] {
    const keys: string[] = Object.keys(this.snackbarService.getNewSnackbar().actions);
    const verified: string[] = [];
    keys.forEach(s => {
      if (this.snackbarService.getNewSnackbar().actions.hasOwnProperty(s)) {
        verified.push(s);
      }
    });
    return verified;
  }

  executeFunction(s: string) {
    const sn = this.snackbarService.getNewSnackbar();
    sn.actions[s](sn);
  }
}
