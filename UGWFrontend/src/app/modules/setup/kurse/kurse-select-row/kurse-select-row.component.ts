import {Component, Input, OnInit} from '@angular/core';
import {Kurse} from '../../../../../types/Kurs';

@Component({
  selector: 'app-kurse-select-row',
  templateUrl: './kurse-select-row.component.html',
  styleUrls: ['./kurse-select-row.component.scss']
})
export class KurseSelectRowComponent implements OnInit {

  @Input('kurse') kurse: Kurse;
  constructor() { }

  ngOnInit() {
  }

}
