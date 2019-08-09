import {Component} from '@angular/core';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import {InstaComponent, InstaComponentInterface} from '../../register/insta/insta.component';
import {MakesRequests} from '../../../../../types/MakesRequests';
import {handleError} from "../../../../util";

@Component({
  selector: 'app-insta-login',
  templateUrl: './insta-login.component.html',
  styleUrls: ['./insta-login.component.scss']
})
export class InstaLoginComponent implements InstaComponentInterface, MakesRequests {

  error: string;
  loading = false;
  constructor(public loginService: LoginService, public router: Router) { }


  onClick() {
    this.error = undefined;
    const child = InstaComponent.createPopup(window.screen);
    if (child === null) {
      return;
    }
    InstaComponent.startInterval(this, child);
  }

  onData(href: string) {
    const pr = InstaComponent.preRequest(this, href);
    if (pr === null) {
      return;
    }
    const {code, firstPart} = pr;
    this.loginService.instaLogin(code, firstPart).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(['/setup/basics']);
      },
      (error) => handleError(this, error)
    );

  }

}
