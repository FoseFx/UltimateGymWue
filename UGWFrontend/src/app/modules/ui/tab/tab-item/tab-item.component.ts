import {Component, Injector, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TabComponent} from '../tab.component';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss']
})
export class TabItemComponent implements OnInit, OnDestroy {

  private parentComponent: TabComponent;
  public id: string;
  @Input() public label = '';
  @ViewChild(TemplateRef) content;

  constructor(private inj: Injector) {
  }

  ngOnInit() {
    this.id = Math.floor(Math.random() * 1000) + '';
    this.parentComponent = this.inj.get(TabComponent);
    this.parentComponent.registerTab(this);
  }

  ngOnDestroy() {
    this.parentComponent.unregisterTab(this);
  }

}
