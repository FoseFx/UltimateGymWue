import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AppQuery} from '../../../state/app.query';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements AfterViewInit, OnInit {

  constructor(private http: HttpClient, private appQuery: AppQuery) { }

  offset: number;
  now = new Date();
  month: Event[][] = [];

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
    const query = this.query();    

    this.http.get(environment.urls.getEvents + query, {
      headers: {
        Authorization: this.appQuery.loginToken
      }
    }).subscribe(
      (d: {data: Event[], error: boolean}) => {
        const data = d.data;
        console.log(data);
        data.forEach((event: Event) => {

          if (event.format === 'fullday') {
            const date = new Date(event.begin);
            const day = date.getDate();
            this.month[day].push(event);
          } else if (event.format === 'ferien' || event.format === 'time') {
            const begin = new Date(event.begin).getDate();
            const end = new Date(event.end).getDate();
            for (let i = begin; i <= end; i++) {
              this.month[i].push(event);
            }
          } else if (event.format === 'schule') {
            const l = event.begin.toString().length;
            const beginH = +event.begin.toString().substr(0, l > 13 ? 1 : 2);
            const date = new Date(+event.begin.toString().substr(l > 13 ? 1 : 2));
            const day = date.getDate();
            event.beginSchulStunde = beginH;
            event.begin = +date;
            this.month[day].push(event);
          }

        });

        console.log(this.month);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  query(): string {
    const year = this.now.getFullYear();
    const month = this.now.getMonth() + 1;
    return `${year}-${month.toString().length === 1 ? '0' : ''}${month}`;
  }
}

class Event {
  name: string;
  typ: 'ferien'|'klausur'|'ferientag';
  format: 'ferien'|'schule'|'fullday'|'time';
  votes: number;
  by: EventBy;
  beginSchulStunde?: number;
  begin: number; // if type = schule: first one/two digits represent the schulstunde, rest is the date it begins
  end?: number; // Not for typ = Feiertag
  stufe?: string; // only for typ = Klausur or Note
  kurs?: string; // only for typ = Klausur or Note
}
class EventBy {
  name: string;
  uid: string;
}
