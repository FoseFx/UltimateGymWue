import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  showTitle$;

  constructor() { }

  ngOnInit() {
    this.showTitle$ = fromEvent(window, 'resize')
      .pipe(
        map(_ => window.innerWidth < 400)
      );
  }

}
