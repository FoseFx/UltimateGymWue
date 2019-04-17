import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { InputComponent } from './input/input.component';
import { HrComponent } from './hr/hr.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    HrComponent
  ]
})
export class UiModule { }
