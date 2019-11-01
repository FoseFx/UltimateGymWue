import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AppQuery} from '../../../state/app.query';
import {SchoolEvent} from '../../../../types/Event';
import {KeyService} from '../../../services/key.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements AfterViewInit, OnInit, OnDestroy {

  public static EVENT_PREV_MONTH = 0;
  public static EVENT_NEXT_MONTH = 1;

  constructor(public appQuery: AppQuery, public keyService: KeyService) { }

  currentEvent: SchoolEvent = null;
  offset: number;
  @Input() now = new Date();
  @Input() showPrevArrow = true;
  @Input() showNextArrow = true;
  month: SchoolEvent[][] = [];
  @Output() changeMonth: EventEmitter<number> = new EventEmitter();
  keySub: Subscription = null;

  public static isLeapYear(date: Date): boolean { // this is the algorithm visible on the wikipedia page of a leap year
    const year = date.getFullYear();
    if (year % 4 !== 0) {
      return false;
    }
    if (year % 100 !== 0) {
      return true;
    } else {
      return year % 400 === 0;
    }
  }

  ngOnInit(): void {
    const ndays = this.getAmountOfDaysInMonth();
    const firstOfMonth = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
    const offset = firstOfMonth.getDay() - 1; // (0 = So, 1 = mo, ..., 6 = Sa) - 1
    if (offset < 0) {
      this.offset = 6;
    } else {
      this.offset = offset;
    }
    for (let i = 0; i < this.offset; i++) {
      this.month.push(null);
    }
    for (let i = 0; i < ndays; i++) {
      this.month.push([]);
    }
  }

  getAmountOfDaysInMonth(): number {
    const month = this.now.getMonth() + 1;
    if (month !== 2) { // exclude February bc of leap years
      if (month <= 7) {
        return month % 2 === 0 ? 30 : 31;
      } else {
        return month % 2 !== 0 ? 30 : 31;
      }
    } else {
      return MonthComponent.isLeapYear(this.now) ? 29 : 28;
    }
  }


  ngAfterViewInit(): void {
    if (!this.appQuery.hasCredentials()) { return; } // only for the tests
    this.keySub = this.keyService.leftRightlistener$.subscribe(this.onKeyEvent);
    const query = this.query();

    const data: SchoolEvent[] = [{name: 'Demo Event 1', typ: 'ferientag', format: 'fullday', votes: 10, by: {name: 'Demo User', uid: 'DEMOUID'}, begin: +new Date()}];
    console.log(data);
    data.forEach((event: SchoolEvent) => {

      if (event.format === 'fullday') {
        const date = new Date(event.begin);
        const day = date.getDate();
        this.month[day - 1 + this.offset].push(event);
      } else if (event.format === 'ferien' || event.format === 'time') {
        const begin = new Date(event.begin).getDate();
        const end = new Date(event.end).getDate();
        for (let i = begin; i <= end; i++) {
          this.month[i - 1 + this.offset].push(event);
        }
      } else if (event.format === 'schule') {
        const l = event.begin.toString().length;
        const beginH = +event.begin.toString().substr(0, l === 12 ? 1 : 2);
        const date = new Date(+(event.begin.toString().substr(l === 12 ? 1 : 2) + '0' + (l === 12 ? '0' : '')));
        const day = date.getDate();
        event.beginSchulStunde = beginH;
        event.begin = +date;
        this.month[day - 1 + this.offset].push(event);
      }

    });

    console.log('month.month', this.month);
  }

  onKeyEvent(event: number) {
    if (event === KeyService.LEFT_EVENT) {
      this.showPrevMonth();
    } else if (event === KeyService.RIGHT_EVENT) {
      this.showNextMonth();
    }
  }

  ngOnDestroy(): void {
    if (this.keySub) {
      this.keySub.unsubscribe();
    }
  }


  query(): string {
    const year = this.now.getFullYear();
    const month = this.now.getMonth() + 1;
    return `${year}-${month.toString().length === 1 ? '0' : ''}${month}`;
  }

  showNextMonth() {
    this.changeMonth.emit(MonthComponent.EVENT_NEXT_MONTH);
  }
  showPrevMonth() {
    this.changeMonth.emit(MonthComponent.EVENT_PREV_MONTH);
  }
}

