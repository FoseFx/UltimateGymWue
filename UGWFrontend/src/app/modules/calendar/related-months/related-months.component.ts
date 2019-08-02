import { Component } from '@angular/core';
import {MonthComponent} from '../month/month.component';

@Component({
  selector: 'app-related-months',
  templateUrl: './related-months.component.html',
  styleUrls: ['./related-months.component.scss']
})
export class RelatedMonthsComponent {
  MINIMUM_DELTA = -4;
  MAXIMUM_DELTA = 24;
  currentMonth = new Date().getMonth(); // 0 indexed
  currentYear = new Date().getFullYear();
  monthDelta = 0; // 0 = this month, -1 = prev month, 1 = next month and so on
  show = true;
  monthChanged(type: number) {
    const newDelta = Math.min( // use Maximum or smaller
      Math.max( // use Minimum or bigger
        this.monthDelta + ((type === MonthComponent.EVENT_PREV_MONTH) ? -1 : 1), // add or remove one
        this.MINIMUM_DELTA
      ),
      this.MAXIMUM_DELTA
    );
    if (newDelta === this.monthDelta) { return; } // no changes? dont re-render

    this.monthDelta = newDelta;
    this.show = false; // force re-init (I)
    setTimeout(() => this.show = true, 100); // force re-init (II)
  }
  get date(): Date { // returns Date based on dateDelta
    let newYear = this.currentYear;
    let newMonth = this.currentMonth + this.monthDelta;
    if (newMonth > 11) {
      while (newMonth > 11) {
        newYear++;
        newMonth = newMonth - 12;
      }
    } else if (newMonth < 0) {
      while (newMonth < 0) {
        newYear--;
        newMonth = newMonth + 12;
      }
    }
    return new Date(newYear, newMonth);
  }
}
