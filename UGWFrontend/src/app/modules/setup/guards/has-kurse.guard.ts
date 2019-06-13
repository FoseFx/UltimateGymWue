import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SetupQuery} from '../state/setup.query';
import {AppQuery} from '../../../state/app.query';

@Injectable()
export class HasKurseGuard implements CanActivate {

  constructor(private query: SetupQuery, private router: Router, private appQuery: AppQuery) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!!this.query.getSelectedKurse() || !!this.appQuery.getValue().basics) {
      return true;
    }
    return this.router.parseUrl('/setup/basics/kurse');
  }
}
