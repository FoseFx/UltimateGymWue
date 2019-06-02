import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-button',
  templateUrl: './popup-button.component.html',
  styleUrls: ['./popup-button.component.scss']
})
export class PopupButtonComponent implements OnInit {

  @Input() disabled = false;
  constructor() { }

  ngOnInit() {
  }

}
