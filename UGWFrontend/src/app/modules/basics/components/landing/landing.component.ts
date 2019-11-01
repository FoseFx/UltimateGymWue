import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AppQuery} from '../../../../state/app.query';
import {AppService} from '../../../../state/app.service';
import {VertretungsPlanSeite} from '../../../../state/app.store';
import {KeyService} from '../../../../services/key.service';
import {Subscription} from 'rxjs';
import {HasNetworkService} from '../../../../services/has-network.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = false;

  constructor(public readonly appQuery: AppQuery,
              public appService: AppService,
              public hasNtwkService: HasNetworkService,
              public keyService: KeyService) { }

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
    this.loading = true;
    const now = new Date();
    const m = now.getMonth() + 1;
    const day = now.getDate();
    const date = `${day}.${m}.`;
    const data: VertretungsPlanSeite[] = [{infos: [`${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`, '(Fake Data, you\'re in Demo-Mode)'], vp: [{typ: 'e', stunde: '1', oldRaum: '1', newRaum: '---', info: 'Demo', fach: 'Demo', date},{typ: 'e', stunde: '1', oldRaum: '1', newRaum: '---', info: 'Demo', fach: 'Demo', date, nd: 1}]}, {infos: [''], vp: []}];
    this.appService.setVertretungsplan(data);
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
