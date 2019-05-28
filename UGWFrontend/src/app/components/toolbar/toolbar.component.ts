import {Component, OnInit} from '@angular/core';
import {fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppService} from '../../state/app.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  showTitle$;

  constructor(public service: AppService) { }

  ngOnInit() {
    this.showTitle$ = fromEvent(window, 'resize')
      .pipe(
        map(_ => window.innerWidth < 300)
      );
  }

}
