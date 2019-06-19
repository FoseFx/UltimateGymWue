import {Component} from '@angular/core';
import {AppQuery} from '../../../../state/app.query';
import {AppService} from '../../../../state/app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hidden-non-kurse',
  templateUrl: './hidden-non-kurse.component.html',
  styleUrls: ['./hidden-non-kurse.component.scss']
})
export class HiddenNonKurseComponent {

  constructor(public appQuery: AppQuery, private appService: AppService, private router: Router) { }

  allowed = {};

  save() {
    for (const key in this.allowed) {
      if (this.allowed.hasOwnProperty(key)) {
        const val = this.allowed[key];
        if (val === true) {
          this.appService.unHideNonKurse(key);
        }
      }
    }
    this.router.navigate(['/']);
  }

}
