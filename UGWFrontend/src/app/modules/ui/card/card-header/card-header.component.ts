import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderComponent {}
