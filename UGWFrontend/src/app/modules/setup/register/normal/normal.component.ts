import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../../state/setup.query';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent implements OnInit {

  constructor(public query: SetupQuery) { }

  ngOnInit() {
  }

  register() {
  }

}
