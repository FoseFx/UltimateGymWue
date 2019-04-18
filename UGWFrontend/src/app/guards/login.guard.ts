import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AppQuery} from '../state/app.query';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private query: AppQuery, private router: Router) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {



    const allow = this.query.getValue().loginData === null;
    console.log(allow);

    if (!allow){
      // todo this.router.navigate(['/']);
    }

    return allow;
  }

}
