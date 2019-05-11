import { Component } from '@angular/core';
import {AppQuery} from '../../../../state/app.query';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(public readonly appQuery: AppQuery) { }

}
