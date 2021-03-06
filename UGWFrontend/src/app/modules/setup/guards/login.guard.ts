import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AppQuery} from '../../../state/app.query';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private query: AppQuery, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {



    const allow = this.query.getValue().loginData === null;

    if (!allow) {
      return this.router.parseUrl('/');
    }

    return true;
  }

}
