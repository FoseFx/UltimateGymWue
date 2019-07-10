import {Component} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  obj =  {
    'test': () => { console.log('test'); }
  };

  constructor(public snackbarService: SnackbarService) {
  }

  randomId() {
    return Math.random() * 10000;
  }
}
