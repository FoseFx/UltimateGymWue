import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AppQuery} from '../state/app.query';

@Injectable()
export class NeedsSetupGuard implements CanActivate {

  constructor(private query: AppQuery, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {


    const value = this.query.getValue();
    console.log(value);

    const isLoginned = !!value.loginData;
    const hasBasics = !!value.basics;

    if (!isLoginned) {
      this.router.navigate(['/setup/welcome']);
    } else if (!hasBasics) {
      this.router.navigate(['/setup/basics']);
    }

    console.log({isLoginned, hasBasics});
    return isLoginned && hasBasics;
  }

}
