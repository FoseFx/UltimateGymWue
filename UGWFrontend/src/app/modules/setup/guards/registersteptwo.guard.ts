import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
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

    if (!allow){
      this.router.navigate(['/setup/register']);
    }

    return allow;
  }

}
