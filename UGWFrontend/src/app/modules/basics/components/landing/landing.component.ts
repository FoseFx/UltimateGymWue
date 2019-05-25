import {AfterViewInit, Component} from '@angular/core';
import {AppQuery} from '../../../../state/app.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AppService} from '../../../../state/app.service';
import {VertretungsPlanSeite} from "../../../../state/app.store";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit {

  loading = false;

  constructor(public readonly appQuery: AppQuery, private appService: AppService, private http: HttpClient) { }

  ngAfterViewInit() {
    if (!this.appQuery.getValue().loginData) { return; } // only for the tests, guard should not allow this
    if (this.appQuery.hasVertretungsplanCached()) {
      return;
    }
    this.loading = true;
    this.http.get(environment.urls.getVertretung + this.appQuery.getValue().basics.stufe, {
      headers: {
        Authorization: this.appQuery.loginToken,
        'X-GW-Auth': this.appQuery.credentialsToken
      }
    }).subscribe((o: {error: boolean, msg?: string, data: VertretungsPlanSeite[]}) => {
      this.loading = false;
      this.appService.setVertretungsplan(o.data);
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

}
