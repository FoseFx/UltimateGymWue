import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
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
      return this.router.createUrlTree(['/setup/welcome']);
    } else if (!hasBasics) {
      return this.router.createUrlTree(['/setup/basics']);
    }
    return isLoginned && hasBasics;
  }

}
