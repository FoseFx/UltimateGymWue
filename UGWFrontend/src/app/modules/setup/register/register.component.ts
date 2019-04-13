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
    const regex = /^\w{2,} \w{2,}$/;
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
