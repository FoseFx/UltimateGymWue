import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AppQuery} from '../../../../state/app.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AppService} from '../../../../state/app.service';
import {VertretungsPlanSeite} from '../../../../state/app.store';
import {BasicsQuery} from '../../state/basics.query';
import {BasicsService} from '../../state/basics.service';
import {KeyService} from '../../../../services/key.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = false;

  constructor(public readonly appQuery: AppQuery,
              private appService: AppService,
              private http: HttpClient,
              public basicsQuery: BasicsQuery,
              private basicsService: BasicsService,
              private keyService: KeyService) { }

  activeTab = 0;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // listen to key Events
    this.subscriptions.push(
      this.keyService.leftRightlistener$.subscribe((e) => {
        if (e === KeyService.RIGHT_EVENT) {
          this.activeTab = 1;
        } else {
          this.activeTab = 0;
        }
      })
    );
  }


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
      this.appService.setVertretungsplan(o.data);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
