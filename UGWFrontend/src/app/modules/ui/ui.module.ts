import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { InputComponent } from './input/input.component';
import { HrComponent } from './hr/hr.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardHeaderComponent } from './card/card-header/card-header.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent,
    SpinnerComponent,
    CardHeaderComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent,
    CardHeaderComponent
  ]
})
export class UiModule { }
