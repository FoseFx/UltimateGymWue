import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AppQuery} from '../../../state/app.query';

@Injectable()
export class HasCredsGuard implements CanActivate {

  constructor(private query: AppQuery, private router: Router) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {



    const allow = this.query.hasCredentials();

    if (!allow) {
      this.router.navigate(['/setup/basics/creds']);
    }

    return allow;
  }

}
