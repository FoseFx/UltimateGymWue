import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AppQuery} from '../../../state/app.query';

@Injectable()
export class LoginnedGuard implements CanActivate {

  constructor(private query: AppQuery, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {



    const allow = this.query.getValue().loginData !== null;
    console.log(allow);

    if (!allow) {
      return this.router.parseUrl('/setup/welcome');
    }

    return allow;
  }

}
