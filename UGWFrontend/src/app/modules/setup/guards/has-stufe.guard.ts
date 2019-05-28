import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SetupQuery} from '../state/setup.query';

@Injectable({
  providedIn: 'root'
})
export class HasStufeGuard implements CanActivate {

  constructor(private setupQuery: SetupQuery, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.setupQuery.getStufe() !== null) {
      return true;
    }
    return this.router.parseUrl('/setup/basics/stufe');
  }

}
