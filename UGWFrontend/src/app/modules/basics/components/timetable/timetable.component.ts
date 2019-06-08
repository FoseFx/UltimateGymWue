import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppQuery} from '../../../../state/app.query';
import {TimeTable, TimeTableDay, TimeTableField, TimeTableWeek} from '../../../../../types/TT';
import {map} from 'rxjs/operators';
import {KeyService} from '../../../../services/key.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, OnDestroy {

  constructor(private appQuery: AppQuery, private keyService: KeyService) { }

  subscriptions: Subscription[] = [];
  activeTab = 0;



  s$ = this.appQuery.tt$.pipe(map(
    (tt: TimeTable) => {
      if (tt === null) {
        return [[[{}]], [[{}]]];
      }
      // @ts-ignore
      const newTT: DisplayableTimeTable = [];
      tt.forEach((woche: TimeTableWeek) => {
        const newTTforWeek: DisplayableTimeTableStunde[] = [];
        woche.forEach((tag: TimeTableDay, tagIndex: number) => {
          let deepness = 0;
          tag.forEach((field: TimeTableField, fieldIndex: number) => {
            if (!newTTforWeek[fieldIndex]) { // add stunde, if not set yet
              newTTforWeek[fieldIndex] = [];
              if (deepness > 1) { // padding
                for (let i = 0; i <= deepness; i++) {
                  newTTforWeek[fieldIndex].push(null);
                }
              }
            }
            newTTforWeek[fieldIndex].push(field);
            deepness = newTTforWeek[fieldIndex].length;

          });
          for (let i = tag.length; i !== newTTforWeek.length; i++) {
            newTTforWeek.forEach((s) => {
              if (!s[tagIndex]) {
                s[tagIndex] = null;
              }
            });
          }

        });
        newTT.push(newTTforWeek);
      });

      console.log(newTT);
      return newTT;
    }
  ));

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

type DisplayableTimeTable = [DisplayableTimeTableStunde[], DisplayableTimeTableStunde[]];
type DisplayableTimeTableStunde = DisplayableTimeTableTag[];
type DisplayableTimeTableTag = TimeTableField;

/*


[ // wochen
  [ // stunden = woche
    [Montag, Di, Fr],
    Stunde2,
    Stunde3,
    ...10

  ]


 */
