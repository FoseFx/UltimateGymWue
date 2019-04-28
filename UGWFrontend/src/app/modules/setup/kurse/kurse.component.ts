import { Component, OnInit } from '@angular/core';
import {SetupQuery} from '../state/setup.query';

@Component({
  selector: 'app-kurse',
  templateUrl: './kurse.component.html',
  styleUrls: ['./kurse.component.scss']
})
export class KurseComponent implements OnInit {

  constructor(private setupQuery: SetupQuery) { }

  ngOnInit() {
  }

}
