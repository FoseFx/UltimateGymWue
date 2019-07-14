import {Component} from '@angular/core';
import {SnackbarService} from './services/snackbar.service';
import {SnackbarAnimations} from './components/snackbar/snackbar.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: SnackbarAnimations
})
export class AppComponent {
  constructor(public snackbarService: SnackbarService) {
  }
}
