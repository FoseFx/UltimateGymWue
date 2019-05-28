import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from './button/button.component';
import {CardComponent} from './card/card.component';
import {InputComponent} from './input/input.component';
import {HrComponent} from './hr/hr.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {CardHeaderComponent} from './card/card-header/card-header.component';
import {TabComponent} from './tab/tab.component';
import {TabItemComponent} from './tab/tab-item/tab-item.component';
import {SwipableDirective} from './tab/swipable.directive';
import {PopupComponent} from './popup/popup.component';
import { NotSwipableDirective } from './tab/not-swipable.directive';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent,
    SpinnerComponent,
    CardHeaderComponent,
    TabComponent,
    TabItemComponent,
    SwipableDirective,
    PopupComponent,
    NotSwipableDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent,
    CardHeaderComponent,
    TabComponent,
    SpinnerComponent,
    TabItemComponent,
    PopupComponent,
    NotSwipableDirective
  ]
})
export class UiModule { }
