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

  now = new Date();
  month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30];

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    if (!this.appQuery.hasCredentials()) { return; } // only for the tests
    const year = this.now.getFullYear();
    const month = this.now.getMonth() + 1;
    const query = `${year}-${month.toString().length === 1 ? '0' : ''}${month}`;

    this.http.get(environment.urls.getEvents + query, {
      headers: {
        Authorization: this.appQuery.loginToken
      }
    }).subscribe(
      (d: {data: Event[], error: boolean}) => {
        const data = d.data;
        console.log(data);
        data.forEach((event: Event) => {
          // todo
        });

      },
      (err) => {
        console.error(err);
      }
    );
  }
}

class Event {
  name: string;
  typ: 'ferien'|'klausur'|'ferientag';
  format: 'ferien'|'schule'|'fullday'|'time';
  votes: number;
  by: EventBy;
  begin: number;
  end?: number; // Not for typ = Feiertag
  stufe?: string; // only for typ = Klausur or Note
  kurs?: string; // only for typ = Klausur or Note
}
class EventBy {
  name: string;
  uid: string;
}
