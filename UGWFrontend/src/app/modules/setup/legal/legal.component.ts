import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TrackingService} from '../../../services/tracking.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit, AfterViewInit {

  private fragment: string;
  constructor(public trackingService: TrackingService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      this.scrollTo(fragment);
    });
  }

  ngAfterViewInit(): void {
    this.scrollTo(this.fragment);
  }

  scrollTo(s: string) {
    try {
      document.querySelector('#' + s).scrollIntoView({behavior: 'smooth'});
    } catch (e) { }
  }
}
