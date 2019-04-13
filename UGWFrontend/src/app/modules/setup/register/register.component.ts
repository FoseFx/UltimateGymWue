import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  nameValid$;
  name$ = new BehaviorSubject('');
  constructor() { }

  ngOnInit() {
    const regex = /^[A-ZÜÄÖ][a-züäöß]+ [A-ZÜÄÖ][a-züäöß]+$/;
    this.nameValid$ = this.name$.pipe(
      debounceTime(200),
      map((name: string) => regex.test(name))
    );
  }

  newName(event) {
    const target: HTMLInputElement = (event.target) as HTMLInputElement;
    const value = target.value.trim();
    this.name$.next(value);
  }

}
