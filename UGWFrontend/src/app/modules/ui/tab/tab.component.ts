import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {TabItemComponent} from './tab-item/tab-item.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {

  tabs: TabItemComponent[] = [];
  // tslint:disable-next-line:variable-name
  _activeIndex = 0;
  set activeIndex(i: number) {
    this._activeIndex = i;
    this.currentActive.emit(i);
    this.cdref.detectChanges();
  }
  get activeIndex() {
    return this._activeIndex;
  }

  @Input() set setActive(index: number) {
    this.activeIndex = index;
  }
  @Output() currentActive = new EventEmitter();
  constructor(private cdref: ChangeDetectorRef) { }

  labelClicked(i: number): void {
    this.activeIndex = i;
  }

  registerTab(item: TabItemComponent) {
    this.tabs.push(item);
    console.log(this.tabs);
  }

  unregisterTab(item: TabItemComponent) {
    const e = this.tabs.findIndex((i) => i.id === item.id);
    if (e !== -1) {
      this.tabs.splice(e, 1);
    }
  }


}
