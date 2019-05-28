import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SetupQuery} from '../state/setup.query';

@Injectable()
export class RegistersteptwoGuard implements CanActivate {

  constructor(private query: SetupQuery, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const allow = this.query.getValue().name !== null;
    console.log(allow);

    if (!allow) {
      return this.router.parseUrl('/setup/register');
    }

    return true;
  }

}
