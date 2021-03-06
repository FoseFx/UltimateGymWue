import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import {SetupService} from '../state/setup.service';
import {Router} from '@angular/router';
import {TrackingService} from '../../../services/tracking.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  nameValid$: Observable<boolean>;      // used in html
  private nameValid: boolean;           // used in this file
  name$ = new BehaviorSubject('');
  name: string;
  allowTracking = true;

  constructor(private setupService: SetupService, private router: Router, public trackingService: TrackingService) { }

  ngOnInit() {
    const regex = /^[A-ZÜÄÖ][a-züäöß]+ [A-ZÜÄÖ][a-züäöß]+$/;
    this.nameValid$ = this.name$.pipe(
      debounceTime(200),
      map((name: string) => regex.test(name)),
      tap(value => this.nameValid = value)
    );
  }

  newName(event) {
    const target: HTMLInputElement = (event.target) as HTMLInputElement;
    const value = target.value.trim();
    this.name$.next(value);
    this.name = value;
  }

  onClick(type: 'normal'|'google'|'insta') {
    if (!this.nameValid) {
      return;
    }
    this.setupService.lockName(this.name);
    if (this.allowTracking) {
      this.trackingService.giveConsent();
    } else {
      this.trackingService.revokeConsent();
    }
    if (type === 'normal') {
      this.router.navigate(['/setup/register/normal']);
    } else if (type === 'google') {
      this.router.navigate(['/setup/register/google']);
    } else { // insta
      this.router.navigate(['/setup/register/insta']);
    }
    console.log(type);
  }

}
