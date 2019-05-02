import {Component, Input, OnInit} from '@angular/core';
import {Kurse} from '../../../../../types/Kurs';
import {SetupQuery} from '../../state/setup.query';
import {SetupService} from '../../state/setup.service';

@Component({
  selector: 'app-kurse-select-row',
  templateUrl: './kurse-select-row.component.html',
  styleUrls: ['./kurse-select-row.component.scss']
})
export class KurseSelectRowComponent implements OnInit {

  @Input('kurse') kurse: Kurse;
  @Input('title') title: string;
  constructor(public setupQuery: SetupQuery, public setupService: SetupService) { }

  ngOnInit() {
  }

}
